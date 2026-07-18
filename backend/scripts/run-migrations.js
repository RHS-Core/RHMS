import path from 'path';
import { fileURLToPath } from 'url';
import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const umzug = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
    resolve: ({ name, path, context }) => {
      return {
        name,
        path,
        up: async () => {
          // Sử dụng pathToFileURL để chuyển đổi đường dẫn tệp sang URL
          const migration = await import(`file://${path.replace(/\\/g, '/')}`);
          return migration.up({ context });
        },
        down: async () => {
          const migration = await import(`file://${path.replace(/\\/g, '/')}`);
          return migration.down({ context });
        },
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// Định nghĩa hàm runMigrations để thực thi cấu hình Umzug phía trên
const runMigrations = async () => {
  try {
    // Kiểm tra kết nối DB trước khi chạy
    await sequelize.authenticate();
    console.log('Database connection established successfully. Starting migrations...');
    
    // Chạy toàn bộ file migration
    await umzug.up();
    console.log('All migrations have been executed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Gọi hàm chạy thực thi
runMigrations();