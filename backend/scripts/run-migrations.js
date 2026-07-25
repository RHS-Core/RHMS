import path from 'path';
import { fileURLToPath } from 'url';
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
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize, tableName: 'sequelize_meta' }),
      logger: undefined,
    });

    const executed = await umzug.up();
    return executed;
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

runMigrations();