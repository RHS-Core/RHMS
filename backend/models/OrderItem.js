import { DataTypes } from 'sequelize';

export default function defineOrderItemModel(sequelize) {
  return sequelize.define(
    'OrderItem',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id',
      },
      foodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'food_id',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: 'order_items',
      timestamps: true,
      underscored: true,
    }
  );
}
