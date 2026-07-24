import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE users MODIFY COLUMN role ENUM('Customer', 'RestaurantStaff', 'HotelStaff', 'RestaurantManager', 'HotelManager', 'SuperAdmin') NOT NULL DEFAULT 'Customer';
  `);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE users MODIFY COLUMN role ENUM('Customer', 'RestaurantStaff', 'RestaurantManager') NOT NULL DEFAULT 'Customer';
  `);
};
