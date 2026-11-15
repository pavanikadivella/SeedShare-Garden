const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// GET all leases with gardener and plot details (JOIN)
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
  } catch (error) {
    next(error);
  }
});

// GET one lease by ID with gardener and plot details (JOIN) — Added by A. Himaja
router.get('/:id', async (req, res, next) => {
  try {
    const db = await getDb();

    const row = await db.get(
      `SELECT
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
      WHERE leases.id = ?`,
      [req.params.id]
    );

    if (!row) {
      return res.status(404).json({
        error: `Lease ${req.params.id} not found`
      });
    }

    res.status(200).json(row);
  } catch (error) {
    next(error);
  }
});

// POST create a lease
router.post('/', async (req, res, next) => {
  try {
    const { gardener_id, plot_id } = req.body;
    const db = await getDb();

    if (!gardener_id || !plot_id) {
      return res.status(400).json({
        error: 'gardener_id and plot_id are required'
      });
    }

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
  } catch (error) {
    next(error);
  }
});

// PUT update/transfer a lease (reassign gardener or plot) — Added by A. Himaja
router.put('/:id', async (req, res, next) => {
  try {
    const { gardener_id, plot_id } = req.body;
    const db = await getDb();

    const existing = await db.get(
      'SELECT * FROM leases WHERE id = ?',
      [req.params.id]
    );

    if (!existing) {
      return res.status(404).json({
        error: `Lease ${req.params.id} not found`
      });
    }

    if (!gardener_id || !plot_id) {
      return res.status(400).json({
        error: 'gardener_id and plot_id are required'
      });
    }

    const gardener = await db.get('SELECT id FROM gardeners WHERE id = ?', [gardener_id]);
    if (!gardener) {
      return res.status(404).json({ error: `Gardener ${gardener_id} not found` });
    }

    const plot = await db.get('SELECT id FROM plots WHERE id = ?', [plot_id]);
    if (!plot) {
      return res.status(404).json({ error: `Plot ${plot_id} not found` });
    }

    const conflictLease = await db.get(
      'SELECT id FROM leases WHERE plot_id = ? AND id != ?',
      [plot_id, req.params.id]
    );
    if (conflictLease) {
      return res.status(409).json({ error: `Plot ${plot_id} is already leased` });
    }

    await db.run(
      'UPDATE leases SET gardener_id = ?, plot_id = ? WHERE id = ?',
      [gardener_id, plot_id, req.params.id]
    );

    const updated = await db.get('SELECT * FROM leases WHERE id = ?', [req.params.id]);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE a lease (end lease / free up plot) — Added by A. Himaja
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDb();

    const result = await db.run(
      'DELETE FROM leases WHERE id = ?',
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        error: `Lease ${req.params.id} not found`
      });
    }

    res.status(200).json({
      message: `Lease ${req.params.id} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;