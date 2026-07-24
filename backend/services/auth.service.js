import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'webrhms_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const buildUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role,
});

export const register = async ({ name, username, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username?.trim() || null;
  const where = normalizedUsername
    ? {
        [Op.or]: [
          { email: normalizedEmail },
          { username: normalizedUsername },
        ],
      }
    : { email: normalizedEmail };

  const existingUser = await User.findOne({ where });

  if (existingUser) {
    const conflictField = existingUser.email === normalizedEmail ? 'Email' : 'Username';
    const error = new Error(`${conflictField} already exists.`);
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
    role: 'Customer',
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    user: buildUserResponse(user),
    token,
  };
};

export const login = async ({ identifier, password }) => {
  const normalized = identifier.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  const where = isEmail ? { email: normalized.toLowerCase() } : { username: normalized };
  const user = await User.findOne({ where });

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    user: buildUserResponse(user),
    token,
  };
};

export default { register, login };
