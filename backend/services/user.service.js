import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User } from '../models/index.js';

const buildUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role,
  status: user.status,
});

export const getUsersService = async () => {
  const users = await User.findAll({
    order: [['created_at', 'DESC']],
    attributes: ['id', 'name', 'username', 'email', 'role', 'status', 'created_at'],
  });
  return users.map(buildUserResponse);
};

export const createUserService = async ({ name, username, email, password, role }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { email: normalizedEmail },
        { username: normalizedUsername },
      ],
    },
  });

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
    role,
    status: 'ACTIVE',
  });

  return buildUserResponse(user);
};

export const updateUserStatusService = async (userId, status) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  user.status = status;
  await user.save();

  return buildUserResponse(user);
};

export default { getUsersService, createUserService, updateUserStatusService };
