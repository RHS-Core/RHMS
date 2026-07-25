export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || (err.name === 'SequelizeValidationError' ? 400 : 500);
  const message = statusCode === 500 ? 'Internal server error' : (err.message || 'Request failed');

  res.status(statusCode).json({
    success: false,
    message,
    errors: null,
  });
};

export default errorMiddleware;
