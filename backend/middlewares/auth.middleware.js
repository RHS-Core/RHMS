import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'webrhms_secret_key';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      errors: null,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      errors: null,
    });
  }
};

export default authMiddleware;
