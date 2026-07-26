import { validateLoginInput, validateRegisterInput } from './authValidator.js';
import { register as registerUser, login as loginUser, getCurrentUser } from './authService.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return errorResponse(res, 400, 'Validation failed.');
    }

    const result = await registerUser(req.body);
    return successResponse(res, 201, result.message, result.data);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { isValid } = validateLoginInput(req.body);

    if (!isValid) {
      return errorResponse(res, 400, 'Validation failed.');
    }

    const result = await loginUser(req.body);
    return successResponse(res, 200, result.message, result.data);
  } catch (error) {
    return next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const result = await getCurrentUser(req.user.id);
    return successResponse(res, 200, result.message, result.data);
  } catch (error) {
    return next(error);
  }
};

export default {
  register,
  login,
  me,
};
