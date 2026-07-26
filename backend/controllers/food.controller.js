import { createFoodSchema, updateFoodSchema } from '../validators/food.validator.js';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from '../services/food.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listFoods = async (req, res, next) => {
  try {
    const result = await getAllFoods(req.query);
    return successResponse(res, 200, 'Foods fetched successfully', result);
  } catch (error) {
    return next(error);
  }
};

export const getFood = async (req, res, next) => {
  try {
    const food = await getFoodById(req.params.id);
    return successResponse(res, 200, 'Food fetched successfully', food);
  } catch (error) {
    return next(error);
  }
};

export const createFoodHandler = async (req, res, next) => {
  try {
    const { error, value } = createFoodSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const food = await createFood(value, imagePath);

    return successResponse(res, 201, 'Food created successfully', food);
  } catch (error) {
    return next(error);
  }
};

export const updateFoodHandler = async (req, res, next) => {
  try {
    const { error, value } = updateFoodSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const food = await updateFood(req.params.id, value, imagePath);

    return successResponse(res, 200, 'Food updated successfully', food);
  } catch (error) {
    return next(error);
  }
};

export const deleteFoodHandler = async (req, res, next) => {
  try {
    await deleteFood(req.params.id);
    return successResponse(res, 200, 'Food deleted successfully', {});
  } catch (error) {
    return next(error);
  }
};

export default { listFoods, getFood, createFoodHandler, updateFoodHandler, deleteFoodHandler };
