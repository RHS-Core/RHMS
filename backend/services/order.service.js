import { Op } from 'sequelize';
import { sequelize } from '../models/index.js';
import { Order, OrderItem, Food, Table, User } from '../models/index.js';

const statusOrder = ['PENDING', 'PREPARING', 'SERVED', 'COMPLETED'];

const resolveTableStatusAfterOrder = (status) => {
  if (status === 'COMPLETED' || status === 'CANCELLED') {
    return 'CLEANING';
  }
  return 'OCCUPIED';
};

export const createOrder = async ({ userId, tableId, items, status, paymentStatus }) => {
  const table = await Table.findByPk(tableId);
  if (!table) {
    const error = new Error('Table not found.');
    error.statusCode = 404;
    throw error;
  }

  const foodIds = items.map((item) => item.foodId);
  const foods = await Food.findAll({ where: { id: { [Op.in]: foodIds } } });
  if (foods.length !== foodIds.length) {
    const error = new Error('One or more foods not found.');
    error.statusCode = 404;
    throw error;
  }

  const foodMap = new Map(foods.map((food) => [food.id, food]));
  const subtotal = items.reduce((sum, item) => {
    const food = foodMap.get(item.foodId);
    return sum + Number(item.quantity) * Number(food.price);
  }, 0);

  const orderStatus = status || 'PENDING';
  const orderPaymentStatus = paymentStatus || (orderStatus === 'COMPLETED' ? 'PAID' : 'UNPAID');
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.create(
      {
        userId: userId || null,
        tableId,
        totalPrice: subtotal,
        status: orderStatus,
        paymentStatus: orderPaymentStatus,
      },
      { transaction }
    );

    const orderItems = items.map((item) => ({
      orderId: order.id,
      foodId: item.foodId,
      quantity: item.quantity,
      price: Number(foodMap.get(item.foodId).price),
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    const nextTableStatus = orderStatus === 'COMPLETED' ? 'CLEANING' : 'OCCUPIED';
    await table.update({ status: nextTableStatus }, { transaction });

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getAllOrders = async ({ status, tableId, page = 1, limit = 10 }) => {
  const where = {};
  if (status) where.status = status;
  if (tableId) where.tableId = tableId;

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const offset = (safePage - 1) * safeLimit;

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Table, as: 'table', attributes: ['id', 'number', 'capacity', 'status'] },
    ],
    order: [['createdAt', 'DESC']],
    limit: safeLimit,
    offset,
  });

  return {
    items: rows,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems: count,
      totalPages: Math.ceil(count / safeLimit),
    },
  };
};

export const getOrderById = async (id) => {
  const order = await Order.findByPk(id, {
    include: [
      { model: OrderItem, as: 'items', include: [{ model: Food, as: 'food' }] },
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Table, as: 'table', attributes: ['id', 'number', 'capacity', 'status'] },
    ],
  });

  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  return order;
};

export const updateOrderItems = async (orderId, items) => {
  const order = await getOrderById(orderId);

  if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
    const error = new Error('Cannot modify items for a completed or cancelled order.');
    error.statusCode = 400;
    throw error;
  }

  const transaction = await sequelize.transaction();

  try {
    const existingItems = await OrderItem.findAll({ where: { orderId }, transaction });
    const existingMap = new Map(existingItems.map((item) => [item.foodId, item]));

    for (const item of items) {
      if (item.quantity === 0) {
        await OrderItem.destroy({ where: { orderId, foodId: item.foodId }, transaction });
        existingMap.delete(item.foodId);
      } else {
        const food = await Food.findByPk(item.foodId, { transaction });
        if (!food) {
          throw Object.assign(new Error('One or more foods not found.'), { statusCode: 404 });
        }

        if (existingMap.has(item.foodId)) {
          await existingMap.get(item.foodId).update({ quantity: item.quantity, price: Number(food.price) }, { transaction });
          existingMap.set(item.foodId, { ...existingMap.get(item.foodId), quantity: item.quantity, price: Number(food.price) });
        } else {
          await OrderItem.create({ orderId, foodId: item.foodId, quantity: item.quantity, price: Number(food.price) }, { transaction });
        }
      }
    }

    const updatedItems = await OrderItem.findAll({ where: { orderId }, transaction });
    const totalPrice = updatedItems.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0);
    await order.update({ totalPrice }, { transaction });

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const order = await getOrderById(orderId);
  const currentStatus = order.status;

  if (newStatus === currentStatus) {
    return order;
  }

  const currentIndex = statusOrder.indexOf(currentStatus);
  const nextIndex = statusOrder.indexOf(newStatus);

  if (newStatus === 'CANCELLED') {
    if (currentStatus === 'COMPLETED') {
      const error = new Error('Cannot cancel a completed order.');
      error.statusCode = 400;
      throw error;
    }
  } else if (currentIndex === -1 || nextIndex === -1 || nextIndex !== currentIndex + 1) {
    const error = new Error(`Invalid status transition from ${currentStatus} to ${newStatus}.`);
    error.statusCode = 400;
    throw error;
  }

  const transaction = await sequelize.transaction();

  try {
    await order.update({ status: newStatus }, { transaction });

    const table = await Table.findByPk(order.tableId, { transaction });
    if (table) {
      const nextTableStatus = newStatus === 'COMPLETED' ? 'CLEANING' : newStatus === 'CANCELLED' ? 'CLEANING' : 'OCCUPIED';
      await table.update({ status: nextTableStatus }, { transaction });
    }

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default { createOrder, getAllOrders, getOrderById, updateOrderItems, updateOrderStatus };