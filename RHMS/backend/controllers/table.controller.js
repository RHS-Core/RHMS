import { createTableSchema, updateStatusSchema } from '../validators/table.validator.js';
import {
  getAllTables,
  getTableById,
  createTable,
  updateTableStatus,
  deleteTable,
  reserveTable,
} from '../services/table.service.js';

export const listTables = async (req, res, next) => {
  try {
    const tables = await getAllTables();
    return res.status(200).json({
      success: true,
      message: 'Tables fetched successfully',
      data: tables,
    });
  } catch (error) {
    return next(error);
  }
};

export const createTableHandler = async (req, res, next) => {
  try {
    const { error, value } = createTableSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
    }

    const table = await createTable(value);
    return res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: table,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateTableStatusHandler = async (req, res, next) => {
  try {
    const { error, value } = updateStatusSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
    }

    const table = await updateTableStatus(req.params.id, value.status);
    return res.status(200).json({
      success: true,
      message: 'Table status updated successfully',
      data: table,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteTableHandler = async (req, res, next) => {
  try {
    await deleteTable(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Table deleted successfully',
      data: {},
    });
  } catch (error) {
    return next(error);
  }
};

export const reserveTableHandler = async (req, res, next) => {
  try {
    const table = await reserveTable(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Table reserved successfully',
      data: table,
    });
  } catch (error) {
    return next(error);
  }
};

export const getTableHandler = async (req, res, next) => {
  try {
    const table = await getTableById(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Table fetched successfully',
      data: table,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  listTables,
  getTableHandler,
  createTableHandler,
  updateTableStatusHandler,
  deleteTableHandler,
  reserveTableHandler,
};
