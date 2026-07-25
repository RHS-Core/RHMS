import { getUsersService, createUserService, updateUserStatusService, resetUserPasswordService, deleteUserService, changeMyPasswordService } from '../services/user.service.js';
import { createUserSchema, updateUserStatusSchema } from '../validators/user.validator.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await getUsersService();
    return successResponse(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const creatorRole = req.user.role;
    const targetRole = value.role;

    if (['RestaurantManager', 'HotelManager'].includes(creatorRole) && targetRole === 'SuperAdmin') {
      return errorResponse(res, 403, 'Forbidden');
    }

    if (['RestaurantManager'].includes(creatorRole) && targetRole === 'HotelManager') {
      return errorResponse(res, 403, 'Forbidden');
    }

    if (['HotelManager'].includes(creatorRole) && targetRole === 'RestaurantManager') {
      return errorResponse(res, 403, 'Forbidden');
    }

    const user = await createUserService(value);
    return successResponse(res, 201, 'User created successfully', user);
  } catch (error) {
    return next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { error, value } = updateUserStatusSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const result = await updateUserStatusService(req.params.id, value.status);
    return successResponse(res, 200, 'User status updated successfully', result);
  } catch (error) {
    return next(error);
  }
};

export const resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const result = await resetUserPasswordService(req.params.id, newPassword.trim());
    return successResponse(res, 200, 'User password reset successfully', result);
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.params.id);
    return successResponse(res, 200, 'User deleted successfully', result);
  } catch (error) {
    return next(error);
  }
};

export const changeMyPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword || typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
      return errorResponse(res, 400, 'Validation failed');
    }

    if (newPassword.trim().length < 6) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const result = await changeMyPasswordService(req.user.id, oldPassword.trim(), newPassword.trim());
    return successResponse(res, 200, 'Password updated successfully', result);
  } catch (error) {
    return next(error);
  }
};

export default { getUsers, createUser, updateUserStatus, resetUserPassword, deleteUser, changeMyPassword };
