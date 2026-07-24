import { DataTypes } from 'sequelize';

export default function defineOrderModel(sequelize) {
  return sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      tableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'table_id',
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'total_price',
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'PREPARING', 'SERVED', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      paymentStatus: {
        type: DataTypes.ENUM('UNPAID', 'PAID', 'REFUNDED'),
        allowNull: false,
        defaultValue: 'UNPAID',
        field: 'payment_status',
      },
      paymentId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'payment_id',
      },
    },
    {
      tableName: 'orders',
      timestamps: true,
      underscored: true,
    }
  );
}
