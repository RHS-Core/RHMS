import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from '../config/database.js'; 

const umzug = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
    resolve: ({ name, path, context }) => {
      return {
        name: name || path.split(/[\/\\]/).pop(),
        up: async () => {
          const migration = await import(`file://${path}`);
          const upFn = migration.up || migration.default?.up;
          if (typeof upFn !== 'function') {
            throw new Error(`Migration ${name} does not export an 'up' function`);
          }
          return upFn({ context });
        },
        down: async () => {
          const migration = await import(`file://${path}`);
          const downFn = migration.down || migration.default?.down;
          if (typeof downFn !== 'function') {
            throw new Error(`Migration ${name} does not export a 'down' function`);
          }
          return downFn({ context });
        },
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

async function runMigrations() {
  try {
    await umzug.up();
    console.log('All migrations executed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();