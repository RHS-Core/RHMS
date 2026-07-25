import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize, User, Food, Table, Room } from '../../models/index.js'; 

const seedUsers = [
  {
    name: 'System SuperAdmin',
    username: 'superadmin',
    email: 'superadmin@rhms.local',
    password: 'Admin12345',
    role: 'SuperAdmin',
    status: 'ACTIVE',
  },
  {
    name: 'Hotel Manager',
    username: 'hotelmanager',
    email: 'hotelmanager@rhms.local',
    password: 'Admin12345',
    role: 'HotelManager',
    status: 'ACTIVE',
  },
  {
    name: 'Restaurant Manager',
    username: 'restaurantmanager',
    email: 'restaurantmanager@rhms.local',
    password: 'Admin12345',
    role: 'RestaurantManager',
    status: 'ACTIVE',
  },
  {
    name: 'Hotel Staff',
    username: 'hotelstaff',
    email: 'hotelstaff@rhms.local',
    password: 'Staff12345',
    role: 'HotelStaff',
    status: 'ACTIVE',
  },
  {
    name: 'Restaurant Staff',
    username: 'restaurantstaff',
    email: 'restaurantstaff@rhms.local',
    password: 'Staff12345',
    role: 'RestaurantStaff',
    status: 'ACTIVE',
  },
  {
    name: 'Customer Demo',
    username: 'customer',
    email: 'customer@rhms.local',
    password: 'Customer123',
    role: 'Customer',
    status: 'ACTIVE',
  },
];

const seedFoods = [
  { name: 'Beef Burger', price: 120000, category: 'Main', description: 'Burger bò phô mai', status: 'AVAILABLE' },
  { name: 'Seafood Pasta', price: 150000, category: 'Main', description: 'Mì Ý hải sản', status: 'AVAILABLE' },
  { name: 'Caesar Salad', price: 85000, category: 'Salad', description: 'Salad Caesar', status: 'AVAILABLE' },
  { name: 'Tom Yum Soup', price: 95000, category: 'Soup', description: 'Canh Tom Yum', status: 'AVAILABLE' },
  { name: 'Chocolate Cake', price: 65000, category: 'Dessert', description: 'Bánh chocolate', status: 'AVAILABLE' },
];

const seedTables = [
  { tableNumber: 1, capacity: 2, status: 'AVAILABLE' },
  { tableNumber: 2, capacity: 4, status: 'AVAILABLE' },
  { tableNumber: 3, capacity: 4, status: 'RESERVED' },
  { tableNumber: 4, capacity: 6, status: 'AVAILABLE' },
  { tableNumber: 5, capacity: 8, status: 'CLEANING' },
];

const seedRooms = [
  { roomNumber: '101', name: 'Deluxe City View', capacity: 2, serviceFee: 200000, status: 'AVAILABLE', amenities: ['WiFi', 'TV', 'Mini Bar'] },
  { roomNumber: '102', name: 'Deluxe Garden View', capacity: 2, serviceFee: 220000, status: 'AVAILABLE', amenities: ['WiFi', 'Bathtub', 'Mini Bar'] },
  { roomNumber: '201', name: 'Executive Suite', capacity: 3, serviceFee: 350000, status: 'RESERVED', amenities: ['WiFi', 'TV', 'Workspace'] },
  { roomNumber: '202', name: 'Family Room', capacity: 4, serviceFee: 400000, status: 'AVAILABLE', amenities: ['WiFi', 'TV', 'Sofa Bed'] },
  { roomNumber: '301', name: 'Presidential Room', capacity: 4, serviceFee: 800000, status: 'CLEANING', amenities: ['WiFi', 'Jacuzzi', 'Panorama View'] },
];

const hasExistingData = async () => {
  const [userCount, foodCount, tableCount, roomCount] = await Promise.all([
    User.count(),
    Food.count(),
    Table.count(),
    Room.count(),
  ]);

  return userCount > 0 || foodCount > 0 || tableCount > 0 || roomCount > 0;
};

const seed = async () => {
  await sequelize.authenticate();

  const existingData = await hasExistingData();
  if (existingData) {
    process.stdout.write('Seed skipped: data already exists.\n');
    await sequelize.close();
    return;
  }

  const hashedUsers = await Promise.all(
    seedUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  await User.bulkCreate(hashedUsers);
  await Food.bulkCreate(seedFoods);
  await Table.bulkCreate(
    seedTables.map(({ tableNumber, ...table }) => ({
      ...table,
      number: tableNumber,
    }))
  );
  await Room.bulkCreate(seedRooms);

  process.stdout.write('Seed completed successfully.\n');
  await sequelize.close();
};

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await sequelize.close();
  process.exitCode = 1;
});