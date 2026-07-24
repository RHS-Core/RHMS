import { Op } from 'sequelize';
import { Food } from '../models/index.js';

const buildPagination = ({ page = 1, limit = 10 }) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));

  return {
    page: safePage,
    limit: safeLimit,
  };
};

export const getAllFoods = async ({ page, limit, category, search, sort }) => {
  const { page: currentPage, limit: pageSize } = buildPagination({ page, limit });
  const offset = (currentPage - 1) * pageSize;

  const where = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

  let order = [];
  switch (sort) {
    case 'price_desc':
      order = [['price', 'DESC']];
      break;
    case 'name_asc':
      order = [['name', 'ASC']];
      break;
    case 'price_asc':
    default:
      order = [['price', 'ASC']];
      break;
  }

  const { count, rows } = await Food.findAndCountAll({
    where,
    order,
    limit: pageSize,
    offset,
  });

  return {
    items: rows,
    pagination: {
      page: currentPage,
      limit: pageSize,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
    },
  };
};

export const getFoodById = async (id) => {
  const food = await Food.findByPk(id);
  if (!food) {
    const error = new Error('Food not found.');
    error.statusCode = 404;
    throw error;
  }
  return food;
};

export const createFood = async (data, imagePath) => {
  const payload = {
    ...data,
    imageUrl: imagePath || null,
  };
  return Food.create(payload);
};

export const updateFood = async (id, data, imagePath) => {
  const food = await getFoodById(id);
  const payload = { ...data };

  if (imagePath) {
    payload.imageUrl = imagePath;
  }

  await food.update(payload);
  return food;
};

export const deleteFood = async (id) => {
  const food = await getFoodById(id);
  await food.destroy();
  return true;
};

export default { getAllFoods, getFoodById, createFood, updateFood, deleteFood };
