import { validateLoginInput, validateRegisterInput } from './authValidator.js';
import { register as registerUser, login as loginUser, getCurrentUser } from './authService.js';

export const register = async (req, res, next) => {
  try {
    const { isValid, errors } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
    }

    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { isValid, errors } = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
    }

    const result = await loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const result = await getCurrentUser(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  me,
};
