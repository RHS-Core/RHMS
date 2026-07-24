export const up = async ({ context: queryInterface }) => {
  const [[{ count }]] = await queryInterface.sequelize.query(`
    SELECT COUNT(*) AS count
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'users'
      AND column_name = 'status';
  `);

  if (count === 0) {
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      ADD COLUMN status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE' AFTER role;
    `);
  }
};

export const down = async ({ context: queryInterface }) => {
  const [[{ count }]] = await queryInterface.sequelize.query(`
    SELECT COUNT(*) AS count
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'users'
      AND column_name = 'status';
  `);

  if (count > 0) {
    await queryInterface.sequelize.query(`
      ALTER TABLE users DROP COLUMN status;
    `);
  }
};
