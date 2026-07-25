export const roleMiddleware = (allowedRoles = []) => (req, res, next) => {
  const currentRole = req.user?.role;

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
      errors: null,
    });
  }

  return next();
};

export default roleMiddleware;
