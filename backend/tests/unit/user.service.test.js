import bcrypt from 'bcryptjs';
import { jest, expect, test, beforeEach } from '@jest/globals';

const userMock = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

jest.unstable_mockModule('../../models/index.js', () => ({
  __esModule: true,
  User: userMock,
}));

const userService = await import('../../services/user.service.js');

beforeEach(() => {
  jest.clearAllMocks();
});

test('createUserService returns a mapped user response', async () => {
  userMock.findOne.mockResolvedValue(null);
  userMock.create.mockResolvedValue({
    id: 20,
    name: 'Eve',
    username: 'eve',
    email: 'eve@example.com',
    role: 'HotelManager',
    status: 'ACTIVE',
  });

  const result = await userService.createUserService({
    name: 'Eve',
    username: 'eve',
    email: 'eve@example.com',
    password: 'Password123',
    role: 'HotelManager',
  });

  expect(result).toEqual({
    id: 20,
    name: 'Eve',
    username: 'eve',
    email: 'eve@example.com',
    role: 'HotelManager',
    status: 'ACTIVE',
  });
});

test('createUserService rejects duplicate email with 409', async () => {
  userMock.findOne.mockResolvedValue({ email: 'eve@example.com' });

  await expect(userService.createUserService({
    name: 'Eve',
    username: 'eve',
    email: 'eve@example.com',
    password: 'Password123',
    role: 'HotelManager',
  })).rejects.toMatchObject({ statusCode: 409, message: 'Email already exists.' });
});

test('updateUserStatusService rejects missing user with 404', async () => {
  userMock.findByPk.mockResolvedValue(null);

  await expect(userService.updateUserStatusService(9, 'ACTIVE')).rejects.toMatchObject({
    statusCode: 404,
    message: 'User not found.',
  });
});

test('deleteUserService rejects SuperAdmin with 403', async () => {
  userMock.findByPk.mockResolvedValue({
    id: 1,
    role: 'SuperAdmin',
    destroy: jest.fn(),
  });

  await expect(userService.deleteUserService(1)).rejects.toMatchObject({
    statusCode: 403,
    message: 'Cannot delete SuperAdmin user.',
  });
});

test('changeMyPasswordService rejects wrong current password with 400', async () => {
  const hashedPassword = await bcrypt.hash('Current123', 10);
  userMock.findByPk.mockResolvedValue({
    id: 2,
    password: hashedPassword,
    save: jest.fn(),
  });

  await expect(userService.changeMyPasswordService(2, 'wrong', 'Newpass123')).rejects.toMatchObject({
    statusCode: 400,
    message: 'Mật khẩu hiện tại không đúng.',
  });
});
