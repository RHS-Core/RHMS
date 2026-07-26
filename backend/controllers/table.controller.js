import { createTableSchema, updateStatusSchema } from '../validators/table.validator.js';
import {
  getAllTables,
  getTableById,
  createTable,
  updateTableStatus,
  deleteTable,
  reserveTable,
} from '../services/table.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listTables = async (req, res, next) => {
  try {
    const tables = await getAllTables();
    return successResponse(res, 200, 'Tables fetched successfully', tables);
  } catch (error) {
    return next(error);
  }
};

export const createTableHandler = async (req, res, next) => {
  try {
    const { error, value } = createTableSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const table = await createTable(value);
    return successResponse(res, 201, 'Table created successfully', table);
  } catch (error) {
    return next(error);
  }
};

export const updateTableStatusHandler = async (req, res, next) => {
  try {
    const { error, value } = updateStatusSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const table = await updateTableStatus(req.params.id, value.status);
    return successResponse(res, 200, 'Table status updated successfully', table);
  } catch (error) {
    return next(error);
  }
};

export const deleteTableHandler = async (req, res, next) => {
  try {
    await deleteTable(req.params.id);
    return successResponse(res, 200, 'Table deleted successfully', {});
  } catch (error) {
    return next(error);
  }
};

export const reserveTableHandler = async (req, res, next) => {
  try {
    const table = await reserveTable(req.params.id);
    return successResponse(res, 200, 'Table reserved successfully', table);
  } catch (error) {
    return next(error);
  }
};

export const getTableHandler = async (req, res, next) => {
  try {
    const table = await getTableById(req.params.id);
    return successResponse(res, 200, 'Table fetched successfully', table);
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
