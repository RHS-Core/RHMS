const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');

export const validateRegisterInput = ({ name, email, password }) => {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long.');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Email must be a valid email address.');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLoginInput = ({ email, password }) => {
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push('Email must be a valid email address.');
  }

  if (!password) {
    errors.push('Password is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateRegisterInput,
  validateLoginInput,
};
