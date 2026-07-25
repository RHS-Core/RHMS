import { getUsersService, createUserService, updateUserStatusService, resetUserPasswordService, deleteUserService, changeMyPasswordService } from '../services/user.service.js';
import { createUserSchema, updateUserStatusSchema } from '../validators/user.validator.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await getUsersService();
    return res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
    }

    const creatorRole = req.user.role;
    const targetRole = value.role;

    if (['RestaurantManager', 'HotelManager'].includes(creatorRole) && targetRole === 'SuperAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
        errors: ['Bạn không có quyền tạo tài khoản SuperAdmin.'],
      });
    }

    if (['RestaurantManager'].includes(creatorRole) && targetRole === 'HotelManager') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
        errors: ['RestaurantManager không thể tạo tài khoản HotelManager.'],
      });
    }

    if (['HotelManager'].includes(creatorRole) && targetRole === 'RestaurantManager') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
        errors: ['HotelManager không thể tạo tài khoản RestaurantManager.'],
      });
    }

    const user = await createUserService(value);
    return res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    return next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { error, value } = updateUserStatusSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
    }

    const result = await updateUserStatusService(req.params.id, value.status);
    return res.status(200).json({ success: true, message: 'User status updated successfully', data: result });
  } catch (error) {
    return next(error);
  }
};

export const resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['newPassword must be at least 6 characters long.'],
      });
    }

    const result = await resetUserPasswordService(req.params.id, newPassword.trim());
    return res.status(200).json({ success: true, message: 'User password reset successfully', data: result });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.params.id);
    return res.status(200).json({ success: true, message: 'User deleted successfully', data: result });
  } catch (error) {
    return next(error);
  }
};

export const changeMyPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword || typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['oldPassword and newPassword are required.'],
      });
    }

    if (newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['newPassword must be at least 6 characters long.'],
      });
    }

    const result = await changeMyPasswordService(req.user.id, oldPassword.trim(), newPassword.trim());
    return res.status(200).json({ success: true, message: 'Password updated successfully', data: result });
  } catch (error) {
    return next(error);
  }
};

export default { getUsers, createUser, updateUserStatus, resetUserPassword, deleteUser, changeMyPassword };
