import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  try {
    await sequelize.authenticate();

    const umzug = new Umzug({
      migrations: {
        glob: ['*.js', { cwd: path.join(__dirname, '..', 'migrations') }],
        resolve: ({ name, path: migrationPath }) => {
          const migrationUrl = pathToFileURL(migrationPath).href;
          
          return {
            name,
            up: async (params) => {
              const mod = await import(migrationUrl);
              // Lấy hàm up từ Named export (export const up) HOẶC Default export (export default)
              const upFn = mod.up || mod.default?.up;
              if (typeof upFn !== 'function') {
                throw new Error(`Migration ${name} lacks a valid 'up' function`);
              }
              return upFn(params);
            },
            down: async (params) => {
              const mod = await import(migrationUrl);
              // Lấy hàm down từ Named export HOẶC Default export
              const downFn = mod.down || mod.default?.down;
              if (typeof downFn !== 'function') {
                throw new Error(`Migration ${name} lacks a valid 'down' function`);
              }
              return downFn(params);
            },
          };
        },
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize, tableName: 'sequelize_meta' }),
      logger: console,
    });

    const executed = await umzug.up();
    console.log('Migrations completed successfully:', executed.map(m => m.name));
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

runMigrations();