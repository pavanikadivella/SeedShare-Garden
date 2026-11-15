const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');
const { validateLease } = require('../middleware/validate');

router.get('/', async (req, res, next) => {
  try {
    const db = await getDb();

    const rows = await db.all(`
      SELECT
        leases.id,
        leases.gardener_id,
        gardeners.name AS gardener_name,
        leases.plot_id,
        plots.name AS plot_name,
        plots.soil AS plot_soil,
        leases.start_date
      FROM leases
      JOIN gardeners ON leases.gardener_id = gardeners.id
      JOIN plots ON leases.plot_id = plots.id
      ORDER BY leases.id ASC
    `);

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const problem = validateLease(req.body);

    if (problem) {
      return res.status(400).json({ error: problem });
    }

    const { gardener_id, plot_id } = req.body;
    const db = await getDb();

    const gardener = await db.get(
      'SELECT id FROM gardeners WHERE id = ?',
      [gardener_id]
    );

    if (!gardener) {
      return res.status(404).json({
        error: `Gardener ${gardener_id} not found`
      });
    }

    const plot = await db.get(
      'SELECT id FROM plots WHERE id = ?',
      [plot_id]
    );

    if (!plot) {
      return res.status(404).json({
        error: `Plot ${plot_id} not found`
      });
    }

    const existingLease = await db.get(
      'SELECT id FROM leases WHERE plot_id = ?',
      [plot_id]
    );

    if (existingLease) {
      return res.status(409).json({
        error: `Plot ${plot_id} is already leased`
      });
    }

    const result = await db.run(
      'INSERT INTO leases (gardener_id, plot_id) VALUES (?, ?)',
      [gardener_id, plot_id]
    );

    const created = await db.get(
      'SELECT * FROM leases WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

module.exports = router;