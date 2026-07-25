import { register as registerUser, login as loginUser } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const result = await registerUser(value);

    return successResponse(res, 201, 'User registered successfully', result);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const result = await loginUser(value);

    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    return next(error);
  }
};

export default { register, login };
