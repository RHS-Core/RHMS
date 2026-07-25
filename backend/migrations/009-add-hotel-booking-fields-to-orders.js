import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('orders', 'hotel_booking_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await queryInterface.addColumn('orders', 'room_number', {
    type: DataTypes.STRING(50),
    allowNull: true,
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('orders', 'room_number');
  await queryInterface.removeColumn('orders', 'hotel_booking_id');
};