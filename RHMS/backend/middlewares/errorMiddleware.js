export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || (err.name === 'SequelizeValidationError' ? 400 : 500);
  const isSequelizeError = [
    'SequelizeValidationError',
    'SequelizeUniqueConstraintError',
    'SequelizeForeignKeyConstraintError',
  ].includes(err.name);

  let errors = [];

  if (isSequelizeError) {
    errors = err.errors?.map((error) => error.message) || [err.message || 'Validation failed'];
  } else if (Array.isArray(err.errors)) {
    errors = err.errors;
  } else if (err.message) {
    errors = [err.message];
  } else {
    errors = ['Internal server error'];
  }

  const message = statusCode === 500 ? 'Internal server error' : (err.message || 'Request failed');

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default errorMiddleware;
