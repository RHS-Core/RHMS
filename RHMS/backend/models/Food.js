import { DataTypes } from 'sequelize';

export default function defineFoodModel(sequelize) {
  return sequelize.define(
    'Food',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'image_url',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('AVAILABLE', 'OUT_OF_STOCK'),
        allowNull: false,
        defaultValue: 'AVAILABLE',
      },
    },
    {
      tableName: 'foods',
      timestamps: true,
      underscored: true,
    }
  );
}
