import { DataTypes } from 'sequelize';

export default function defineRoomModel(sequelize) {
  return sequelize.define(
    'Room',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      roomNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'room_number',
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      serviceFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'service_fee',
      },
      status: {
        type: DataTypes.ENUM('AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING', 'OUT_OF_SERVICE'),
        allowNull: false,
        defaultValue: 'AVAILABLE',
      },
      amenities: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: 'rooms',
      timestamps: true,
      underscored: true,
    }
  );
}