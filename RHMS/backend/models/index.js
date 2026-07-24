import sequelize from '../config/database.js';
import defineUserModel from './User.js';
import defineFoodModel from './Food.js';
import defineTableModel from './Table.js';
import defineOrderModel from './Order.js';
import defineOrderItemModel from './OrderItem.js';

const User = defineUserModel(sequelize);
const Food = defineFoodModel(sequelize);
const Table = defineTableModel(sequelize);
const Order = defineOrderModel(sequelize);
const OrderItem = defineOrderItemModel(sequelize);

// User └──< Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Table └──< Order
Table.hasMany(Order, { foreignKey: 'tableId', as: 'orders' });
Order.belongsTo(Table, { foreignKey: 'tableId', as: 'table' });

// Order └──< OrderItem >── Food
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Food.hasMany(OrderItem, { foreignKey: 'foodId', as: 'orderItems' });
OrderItem.belongsTo(Food, { foreignKey: 'foodId', as: 'food' });

export { sequelize, User, Food, Table, Order, OrderItem };
export default { sequelize, User, Food, Table, Order, OrderItem };
