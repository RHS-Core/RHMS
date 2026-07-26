import bcrypt from 'bcryptjs';
import 'dotenv/config';
import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

const run = async () => {
  try {
    await sequelize.authenticate();

    const [results] = await sequelize.query(`
      SELECT COUNT(*) AS count FROM information_schema.columns
      WHERE table_schema = :db AND table_name = 'users' AND column_name = 'role'
    `, {
      replacements: { db: process.env.DB_NAME || 'webrhms' },
    });

    const roleColumnExists = results[0]?.count > 0;
    if (!roleColumnExists) {
      throw new Error('User table does not appear to contain a role column. Run migrations first.');
    }

    const username = 'superadmin';
    const email = 'superadmin@example.com';
    const password = 'Admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const [users] = await sequelize.query(
      'SELECT * FROM users WHERE username = :username OR email = :email',
      {
        replacements: { username, email },
        type: QueryTypes.SELECT,
      }
    );

    if (users) {
      process.exit(0);
    }

    await sequelize.query(
      `INSERT INTO users (name, username, email, password, role, created_at, updated_at)
       VALUES (:name, :username, :email, :password, :role, NOW(), NOW())`,
      {
        replacements: {
          name: 'Tổng Quản Lý Hệ Thống',
          username,
          email,
          password: hashedPassword,
          role: 'SuperAdmin',
        },
      }
    );
  } catch (error) {
    console.error('Failed to seed SuperAdmin:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
