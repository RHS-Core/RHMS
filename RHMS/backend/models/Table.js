import { DataTypes } from 'sequelize';

export default function defineTableModel(sequelize) {
  return sequelize.define(
    'Table',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      status: {
        type: DataTypes.ENUM('AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING'),
        allowNull: false,
        defaultValue: 'AVAILABLE',
      },
    },
    {
      tableName: 'tables',
      timestamps: true,
      underscored: true,
    }
  );
}
