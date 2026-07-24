import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('users', 'username', {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('users', 'username');
};