const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: path.join(__dirname, '..', 'seedShareGarden.db'),
    driver: sqlite3.Database,
  });

  await dbInstance.exec('PRAGMA foreign_keys = ON;');

  // Table 1: gardeners
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS gardeners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );
  `);

  // Table 2: plots (name and soil)
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS plots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      soil TEXT NOT NULL
    );
  `);

  // Table 3: leases (relates gardeners and plots)
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS leases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gardener_id INTEGER NOT NULL,
      plot_id INTEGER NOT NULL,
      start_date TEXT NOT NULL DEFAULT (date('now')),
      FOREIGN KEY (gardener_id) REFERENCES gardeners(id) ON DELETE CASCADE,
      FOREIGN KEY (plot_id) REFERENCES plots(id) ON DELETE CASCADE
    );
  `);

  // Seed initial sample records if empty
  const { count } = await dbInstance.get('SELECT COUNT(*) AS count FROM plots');
  if (count === 0) {
    await dbInstance.run(
      `INSERT INTO gardeners (name, email) VALUES 
       ('Asha', 'asha@seedshare.local'),
       ('Rohan', 'rohan@seedshare.local')`
    );
    await dbInstance.run(
      `INSERT INTO plots (name, soil) VALUES 
       ('Sunny Plot A1', 'Loamy'),
       ('Shaded Plot B2', 'Clay'),
       ('Herb Corner C3', 'Sandy Loam')`
    );
    await dbInstance.run(
      `INSERT INTO leases (gardener_id, plot_id, start_date) VALUES 
       (1, 1, '2026-11-01'),
       (2, 2, '2026-11-05')`
    );
  }

  return dbInstance;
}

module.exports = { getDb };