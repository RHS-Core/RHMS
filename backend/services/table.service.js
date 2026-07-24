import { Table } from '../models/index.js';

export const getAllTables = async () => Table.findAll({ order: [['number', 'ASC']] });

export const getTableById = async (id) => {
  const table = await Table.findByPk(id);
  if (!table) {
    const error = new Error('Table not found.');
    error.statusCode = 404;
    throw error;
  }
  return table;
};

export const createTable = async (data) => {
  const existingTable = await Table.findOne({ where: { number: data.tableNumber } });

  if (existingTable) {
    const error = new Error('Table number already exists.');
    error.statusCode = 409;
    throw error;
  }

  return Table.create({
    number: data.tableNumber,
    capacity: data.capacity,
    status: data.status || 'AVAILABLE',
  });
};

export const updateTableStatus = async (id, status) => {
  const table = await getTableById(id);
  await table.update({ status });
  return table;
};

export const deleteTable = async (id) => {
  const table = await getTableById(id);
  await table.destroy();
  return true;
};

/**
 * Đặt bàn tạm thời bằng cách chuyển trạng thái bàn sang RESERVED.
 * Đây chỉ là logic giữ chỗ trước khi khách thực sự ngồi vào bàn và chuyển sang OCCUPIED,
 * không tạo một bản ghi riêng trong bảng Reservation như hệ thống đặt bàn đầy đủ.
 */
export const reserveTable = async (id) => {
  const table = await getTableById(id);

  if (table.status === 'RESERVED' || table.status === 'OCCUPIED') {
    const error = new Error(`Bàn hiện tại không thể đặt do đang ở trạng thái ${table.status}`);
    error.statusCode = 409;
    throw error;
  }

  if (table.status !== 'AVAILABLE') {
    const error = new Error('Bàn hiện tại không thể đặt do đang ở trạng thái không phù hợp.');
    error.statusCode = 409;
    throw error;
  }

  await table.update({ status: 'RESERVED' });
  return table;
};

export default { getAllTables, getTableById, createTable, updateTableStatus, deleteTable, reserveTable };
