import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';
import 'dotenv/config';
import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

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
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (users) {
      console.log('SuperAdmin user already exists.');
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

    console.log('SuperAdmin account created successfully.');
    console.log('Login with username: superadmin and password: Admin123');
  } catch (error) {
    console.error('Failed to seed SuperAdmin:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
