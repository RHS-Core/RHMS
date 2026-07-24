import { DataTypes } from 'sequelize';

export default function defineUserModel(sequelize) {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [8, 255],
        },
      },
      role: {
        type: DataTypes.ENUM('Customer', 'RestaurantStaff', 'RestaurantManager'),
        allowNull: false,
        defaultValue: 'Customer',
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
    }
  );
}
