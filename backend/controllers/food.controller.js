import { createFoodSchema, updateFoodSchema } from '../validators/food.validator.js';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from '../services/food.service.js';

export const listFoods = async (req, res, next) => {
  try {
    const result = await getAllFoods(req.query);
    return res.status(200).json({
      success: true,
      message: 'Foods fetched successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getFood = async (req, res, next) => {
  try {
    const food = await getFoodById(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Food fetched successfully',
      data: food,
    });
  } catch (error) {
    return next(error);
  }
};

export const createFoodHandler = async (req, res, next) => {
  try {
    const { error, value } = createFoodSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const food = await createFood(value, imagePath);

    return res.status(201).json({
      success: true,
      message: 'Food created successfully',
      data: food,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateFoodHandler = async (req, res, next) => {
  try {
    const { error, value } = updateFoodSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const food = await updateFood(req.params.id, value, imagePath);

    return res.status(200).json({
      success: true,
      message: 'Food updated successfully',
      data: food,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteFoodHandler = async (req, res, next) => {
  try {
    await deleteFood(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Food deleted successfully',
      data: {},
    });
  } catch (error) {
    return next(error);
  }
};

export default { listFoods, getFood, createFoodHandler, updateFoodHandler, deleteFoodHandler };
