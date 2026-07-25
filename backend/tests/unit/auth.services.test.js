import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jest, describe, beforeEach, expect, test } from '@jest/globals';

const userMock = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
};

jest.unstable_mockModule('../../models/index.js', () => ({
  __esModule: true,
  User: userMock,
}));

const backendAuthService = await import('../../services/auth.service.js');
const restaurantAuthService = await import('../../modules/restaurant/authService.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('backend auth.service', () => {
  test('register returns token and customer profile', async () => {
    userMock.findOne.mockResolvedValue(null);
    userMock.create.mockResolvedValue({
      id: 1,
      name: 'Alice',
      username: 'alice',
      email: 'alice@example.com',
      role: 'Customer',
    });

    const result = await backendAuthService.register({
      name: 'Alice',
      username: 'alice',
      email: 'Alice@Example.com',
      password: 'Password123',
    });

    expect(userMock.findOne).toHaveBeenCalledTimes(1);
    expect(userMock.create).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Alice',
      username: 'alice',
      email: 'alice@example.com',
      role: 'Customer',
    }));
    expect(result.user).toEqual({
      id: 1,
      name: 'Alice',
      username: 'alice',
      email: 'alice@example.com',
      role: 'Customer',
    });
    expect(jwt.decode(result.token)).toMatchObject({
      id: 1,
      email: 'alice@example.com',
      role: 'Customer',
    });
  });

  test('register rejects duplicate email or username', async () => {
    userMock.findOne.mockResolvedValue({ email: 'alice@example.com' });

    await expect(
      backendAuthService.register({
        name: 'Alice',
        username: 'alice',
        email: 'alice@example.com',
        password: 'Password123',
      })
    ).rejects.toMatchObject({ statusCode: 409, message: 'Email already exists.' });
  });

  test('login returns token when password matches', async () => {
    const hashedPassword = await bcrypt.hash('Password123', 10);
    userMock.findOne.mockResolvedValue({
      id: 2,
      name: 'Bob',
      username: 'bob',
      email: 'bob@example.com',
      password: hashedPassword,
      role: 'RestaurantStaff',
    });

    const result = await backendAuthService.login({
      identifier: 'bob@example.com',
      password: 'Password123',
    });

    expect(result.user).toEqual({
      id: 2,
      name: 'Bob',
      username: 'bob',
      email: 'bob@example.com',
      role: 'RestaurantStaff',
    });
    expect(jwt.decode(result.token)).toMatchObject({
      id: 2,
      email: 'bob@example.com',
      role: 'RestaurantStaff',
    });
  });

  test('login rejects unknown user with 401', async () => {
    userMock.findOne.mockResolvedValue(null);

    await expect(
      backendAuthService.login({ identifier: 'missing@example.com', password: 'Password123' })
    ).rejects.toMatchObject({ statusCode: 401, message: 'Invalid email or password.' });
  });
});

describe('restaurant authService', () => {
  test('register creates a restaurant customer response', async () => {
    userMock.findOne.mockResolvedValue(null);
    userMock.create.mockResolvedValue({
      id: 11,
      name: 'Charlie',
      email: 'charlie@example.com',
      role: 'RestaurantStaff',
    });

    const result = await restaurantAuthService.register({
      name: 'Charlie',
      email: 'charlie@example.com',
      password: 'Password123',
      role: 'RestaurantStaff',
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe('User registered successfully.');
    expect(result.data.user).toEqual({
      id: 11,
      name: 'Charlie',
      email: 'charlie@example.com',
      role: 'RestaurantStaff',
    });
  });

  test('login rejects invalid password with 401', async () => {
    const hashedPassword = await bcrypt.hash('Password123', 10);
    userMock.findOne.mockResolvedValue({
      id: 12,
      name: 'Dana',
      email: 'dana@example.com',
      password: hashedPassword,
      role: 'Customer',
    });

    await expect(
      restaurantAuthService.login({ email: 'dana@example.com', password: 'wrong-password' })
    ).rejects.toMatchObject({ statusCode: 401, message: 'Invalid email or password.' });
  });

  test('getCurrentUser rejects missing user with 404', async () => {
    userMock.findByPk.mockResolvedValue(null);

    await expect(restaurantAuthService.getCurrentUser(99)).rejects.toMatchObject({
      statusCode: 404,
      message: 'User not found.',
    });
  });
});
