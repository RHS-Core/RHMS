import { jest, describe, beforeEach, expect, test } from '@jest/globals';

const sequelizeMock = {
  transaction: jest.fn(),
};

const foodMock = {
  findAndCountAll: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

const tableMock = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

const orderMock = {
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

const orderItemMock = {
  bulkCreate: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
  create: jest.fn(),
};

const userMock = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
};

jest.unstable_mockModule('../../models/index.js', () => ({
  __esModule: true,
  sequelize: sequelizeMock,
  Food: foodMock,
  Table: tableMock,
  Order: orderMock,
  OrderItem: orderItemMock,
  User: userMock,
}));

const foodService = await import('../../services/food.service.js');
const tableService = await import('../../services/table.service.js');
const orderService = await import('../../services/order.service.js');

beforeEach(() => {
  jest.clearAllMocks();
  sequelizeMock.transaction.mockResolvedValue({
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
  });
});

describe('food.service', () => {
  test('getAllFoods applies pagination and sorting', async () => {
    foodMock.findAndCountAll.mockResolvedValue({
      count: 2,
      rows: [{ id: 1, name: 'Burger' }, { id: 2, name: 'Pizza' }],
    });

    const result = await foodService.getAllFoods({ page: 2, limit: 5, category: 'Main', search: 'u', sort: 'name_asc' });

    expect(foodMock.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ category: 'Main' }),
      order: [['name', 'ASC']],
      limit: 5,
      offset: 5,
    }));
    expect(result.pagination).toEqual({
      page: 2,
      limit: 5,
      totalItems: 2,
      totalPages: 1,
    });
  });

  test('getFoodById throws 404 when food is missing', async () => {
    foodMock.findByPk.mockResolvedValue(null);

    await expect(foodService.getFoodById(10)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Food not found.',
    });
  });

  test('createFood passes imageUrl into create payload', async () => {
    foodMock.create.mockResolvedValue({ id: 7 });

    await foodService.createFood({ name: 'Soup', price: 30, category: 'Starter' }, '/uploads/soup.png');

    expect(foodMock.create).toHaveBeenCalledWith({
      name: 'Soup',
      price: 30,
      category: 'Starter',
      imageUrl: '/uploads/soup.png',
    });
  });

  test('updateFood updates the found record', async () => {
    const foodRecord = {
      update: jest.fn().mockResolvedValue(undefined),
    };
    foodMock.findByPk.mockResolvedValue(foodRecord);

    const result = await foodService.updateFood(3, { price: 50 }, '/uploads/new.png');

    expect(foodRecord.update).toHaveBeenCalledWith({ price: 50, imageUrl: '/uploads/new.png' });
    expect(result).toBe(foodRecord);
  });

  test('deleteFood destroys the found record', async () => {
    const foodRecord = {
      destroy: jest.fn().mockResolvedValue(undefined),
    };
    foodMock.findByPk.mockResolvedValue(foodRecord);

    const result = await foodService.deleteFood(3);

    expect(foodRecord.destroy).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });
});

describe('table.service', () => {
  test('createTable rejects duplicate table number', async () => {
    tableMock.findOne.mockResolvedValue({ number: 12 });

    await expect(tableService.createTable({ tableNumber: 12, capacity: 4 })).rejects.toMatchObject({
      statusCode: 409,
      message: 'Table number already exists.',
    });
  });

  test('reserveTable updates an available table', async () => {
    const tableRecord = {
      id: 5,
      status: 'AVAILABLE',
      update: jest.fn().mockResolvedValue(undefined),
    };
    tableMock.findByPk.mockResolvedValue(tableRecord);

    const result = await tableService.reserveTable(5);

    expect(tableRecord.update).toHaveBeenCalledWith({ status: 'RESERVED' });
    expect(result).toBe(tableRecord);
  });

  test('reserveTable rejects occupied table with 409', async () => {
    tableMock.findByPk.mockResolvedValue({ id: 6, status: 'OCCUPIED' });

    await expect(tableService.reserveTable(6)).rejects.toMatchObject({
      statusCode: 409,
      message: 'Bàn hiện tại không thể đặt do đang ở trạng thái OCCUPIED',
    });
  });

  test('updateTableStatus updates status on found table', async () => {
    const tableRecord = {
      update: jest.fn().mockResolvedValue(undefined),
    };
    tableMock.findByPk.mockResolvedValue(tableRecord);

    const result = await tableService.updateTableStatus(2, 'CLEANING');

    expect(tableRecord.update).toHaveBeenCalledWith({ status: 'CLEANING' });
    expect(result).toBe(tableRecord);
  });
});

describe('order.service', () => {
  test('createOrder creates order items and marks table occupied', async () => {
    const transaction = {
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
    };
    sequelizeMock.transaction.mockResolvedValue(transaction);

    const tableRecord = {
      id: 8,
      update: jest.fn().mockResolvedValue(undefined),
    };
    const food1 = { id: 1, price: 25 };
    const food2 = { id: 2, price: 15 };
    tableMock.findByPk.mockResolvedValue(tableRecord);
    foodMock.findAll.mockResolvedValue([food1, food2]);
    orderMock.create.mockResolvedValue({ id: 101, tableId: 8 });

    const result = await orderService.createOrder({
      userId: 9,
      tableId: 8,
      items: [
        { foodId: 1, quantity: 2 },
        { foodId: 2, quantity: 1 },
      ],
    });

    expect(orderMock.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: 9,
      tableId: 8,
      totalPrice: 65,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
    }), expect.objectContaining({ transaction }));
    expect(orderItemMock.bulkCreate).toHaveBeenCalledWith([
      { orderId: 101, foodId: 1, quantity: 2, price: 25 },
      { orderId: 101, foodId: 2, quantity: 1, price: 15 },
    ], expect.objectContaining({ transaction }));
    expect(tableRecord.update).toHaveBeenCalledWith({ status: 'OCCUPIED' }, expect.objectContaining({ transaction }));
    expect(transaction.commit).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 101, tableId: 8 });
  });

  test('createOrder forwards hotel booking metadata to the order payload', async () => {
    const transaction = {
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
    };
    sequelizeMock.transaction.mockResolvedValue(transaction);

    const tableRecord = {
      id: 8,
      update: jest.fn().mockResolvedValue(undefined),
    };
    tableMock.findByPk.mockResolvedValue(tableRecord);
    foodMock.findAll.mockResolvedValue([{ id: 1, price: 25 }]);
    orderMock.create.mockResolvedValue({ id: 102, tableId: 8 });

    await orderService.createOrder({
      userId: 9,
      tableId: 8,
      hotelBookingId: 501,
      roomNumber: '1208',
      items: [{ foodId: 1, quantity: 1 }],
    });

    expect(orderMock.create).toHaveBeenCalledWith(expect.objectContaining({
      hotelBookingId: 501,
      roomNumber: '1208',
    }), expect.objectContaining({ transaction }));
  });

  test('createOrder throws 404 when table is missing', async () => {
    tableMock.findByPk.mockResolvedValue(null);

    await expect(orderService.createOrder({ tableId: 1, items: [{ foodId: 1, quantity: 1 }] })).rejects.toMatchObject({
      statusCode: 404,
      message: 'Table not found.',
    });
  });

  test('updateOrderStatus rejects invalid transition with 400', async () => {
    orderMock.findByPk.mockResolvedValue({
      id: 12,
      status: 'PENDING',
      tableId: 8,
      update: jest.fn(),
    });

    await expect(orderService.updateOrderStatus(12, 'SERVED')).rejects.toMatchObject({
      statusCode: 400,
      message: 'Invalid status transition from PENDING to SERVED.',
    });
  });

  test('updateOrderItems recalculates the order total', async () => {
    const transaction = {
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
    };
    sequelizeMock.transaction.mockResolvedValue(transaction);

    const orderRecord = {
      id: 15,
      status: 'PENDING',
      tableId: 8,
      update: jest.fn().mockResolvedValue(undefined),
    };
    const existingItem = {
      foodId: 1,
      quantity: 1,
      price: 20,
      update: jest.fn().mockResolvedValue(undefined),
    };
    orderMock.findByPk.mockResolvedValue(orderRecord);
    orderItemMock.findAll.mockResolvedValueOnce([existingItem]).mockResolvedValueOnce([
      { foodId: 1, quantity: 3, price: 20 },
    ]);
    foodMock.findByPk.mockResolvedValue({ id: 1, price: 20 });

    const result = await orderService.updateOrderItems(15, [{ foodId: 1, quantity: 3 }]);

    expect(existingItem.update).toHaveBeenCalledWith({ quantity: 3, price: 20 }, expect.objectContaining({ transaction }));
    expect(orderRecord.update).toHaveBeenCalledWith({ totalPrice: 60 }, expect.objectContaining({ transaction }));
    expect(transaction.commit).toHaveBeenCalledTimes(1);
    expect(result).toBe(orderRecord);
  });
});
