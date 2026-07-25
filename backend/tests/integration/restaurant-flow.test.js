import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { jest, beforeEach, expect, test } from '@jest/globals';

const loginMock = jest.fn();
const reserveTableMock = jest.fn();
const updateTableStatusMock = jest.fn();
const createOrderMock = jest.fn();

jest.unstable_mockModule('../../services/auth.service.js', () => ({
  __esModule: true,
  login: loginMock,
  register: jest.fn(),
}));

jest.unstable_mockModule('../../services/table.service.js', () => ({
  __esModule: true,
  getAllTables: jest.fn(),
  getTableById: jest.fn(),
  createTable: jest.fn(),
  updateTableStatus: updateTableStatusMock,
  deleteTable: jest.fn(),
  reserveTable: reserveTableMock,
}));

jest.unstable_mockModule('../../services/order.service.js', () => ({
  __esModule: true,
  createOrder: createOrderMock,
  getAllOrders: jest.fn(),
  getOrderById: jest.fn(),
  updateOrderItems: jest.fn(),
  updateOrderStatus: jest.fn(),
}));

const authRoutes = await import('../../routes/auth.routes.js');
const tableRoutes = await import('../../routes/table.routes.js');
const orderRoutes = await import('../../routes/order.routes.js');
const errorMiddleware = (await import('../../middlewares/errorMiddleware.js')).default;

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes.default);
app.use('/api/tables', tableRoutes.default);
app.use('/api/orders', orderRoutes.default);
app.use(errorMiddleware);

beforeEach(() => {
  jest.clearAllMocks();
  loginMock.mockResolvedValue({
    user: { id: 7, name: 'Staff', username: 'staff', email: 'staff@rhms.test', role: 'RestaurantStaff' },
    token: jwt.sign(
      { id: 7, email: 'staff@rhms.test', role: 'RestaurantStaff' },
      process.env.JWT_SECRET || 'webrhms_secret_key',
      { expiresIn: '24h' }
    ),
  });
  reserveTableMock.mockResolvedValue({ id: 3, number: 3, status: 'RESERVED' });
  updateTableStatusMock.mockResolvedValue({ id: 3, number: 3, status: 'OCCUPIED' });
  createOrderMock.mockResolvedValue({ id: 55, tableId: 3, status: 'PENDING' });
});

test('restaurant flow: login -> reserve table -> create order -> update table status', async () => {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ identifier: 'staff@rhms.test', password: 'Password123' });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.data.token).toBeTruthy();

  const token = loginResponse.body.data.token;

  const reserveResponse = await request(app)
    .post('/api/tables/3/reserve')
    .set('Authorization', `Bearer ${token}`)
    .send();

  expect(reserveResponse.status).toBe(200);
  expect(reserveTableMock).toHaveBeenCalledWith('3');

  const orderResponse = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({
      tableId: 3,
      hotelBookingId: 501,
      roomNumber: '1208',
      items: [
        { foodId: 1, quantity: 2 },
        { foodId: 2, quantity: 1 },
      ],
    });

  expect(orderResponse.status).toBe(201);
  expect(createOrderMock).toHaveBeenCalledWith(expect.objectContaining({
    userId: 7,
    tableId: 3,
    hotelBookingId: 501,
    roomNumber: '1208',
    items: [
      { foodId: 1, quantity: 2 },
      { foodId: 2, quantity: 1 },
    ],
    status: 'PENDING',
  }));

  const statusResponse = await request(app)
    .put('/api/tables/3')
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'OCCUPIED' });

  expect(statusResponse.status).toBe(200);
  expect(updateTableStatusMock).toHaveBeenCalledWith('3', 'OCCUPIED');
});

test('restaurant flow rejects unauthorized table access with 401', async () => {
  const response = await request(app).post('/api/tables/3/reserve').send();

  expect(response.status).toBe(401);
  expect(response.body.message).toBe('Unauthorized');
  expect(response.body.errors).toBeNull();
});

test('restaurant flow rejects customer role for table status update with 403', async () => {
  const customerToken = jwt.sign(
    { id: 8, email: 'customer@rhms.test', role: 'Customer' },
    process.env.JWT_SECRET || 'webrhms_secret_key',
    { expiresIn: '24h' }
  );

  const response = await request(app)
    .put('/api/tables/3')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ status: 'OCCUPIED' });

  expect(response.status).toBe(403);
  expect(response.body.errors).toBeNull();
});

test('restaurant flow rejects invalid order payload with 400', async () => {
  const token = jwt.sign(
    { id: 7, email: 'staff@rhms.test', role: 'RestaurantStaff' },
    process.env.JWT_SECRET || 'webrhms_secret_key',
    { expiresIn: '24h' }
  );

  const response = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ tableId: 3, items: [] });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe('Validation failed');
});

test('restaurant flow surfaces service errors as 500', async () => {
  const token = jwt.sign(
    { id: 7, email: 'staff@rhms.test', role: 'RestaurantStaff' },
    process.env.JWT_SECRET || 'webrhms_secret_key',
    { expiresIn: '24h' }
  );

  reserveTableMock.mockRejectedValueOnce(new Error('database failed'));

  const response = await request(app)
    .post('/api/tables/3/reserve')
    .set('Authorization', `Bearer ${token}`)
    .send();

  expect(response.status).toBe(500);
  expect(response.body.message).toBe('Internal server error');
  expect(response.body.errors).toBeNull();
});
