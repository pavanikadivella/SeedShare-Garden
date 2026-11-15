
const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// GET all plots
router.get('/', async (req, res, next) => {
  try {
    const db = await getDb();
    const plots = await db.all('SELECT * FROM plots ORDER BY id ASC');
    res.status(200).json(plots);
  } catch (error) {
    next(error);
  }
});

// GET plot by ID
router.get('/:id', async (req, res, next) => {
  try {
    const db = await getDb();
    const plot = await db.get(
      'SELECT * FROM plots WHERE id = ?',
      [req.params.id]
    );

    if (!plot) {
      return res.status(404).json({
        error: `Plot ${req.params.id} not found`
      });
    }

    res.status(200).json(plot);
  } catch (error) {
    next(error);
  }
});

// POST create plot
router.post('/', async (req, res, next) => {
  try {
    const { name, soil } = req.body;

    if (!name || !soil) {
      return res.status(400).json({
        error: 'Name and soil are required'
      });
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO plots (name, soil) VALUES (?, ?)',
      [name, soil]
    );

    const created = await db.get(
      'SELECT * FROM plots WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

// PUT update plot
router.put('/:id', async (req, res, next) => {
  try {
    const { name, soil } = req.body;
    const db = await getDb();

    const existing = await db.get(
      'SELECT * FROM plots WHERE id = ?',
      [req.params.id]
    );

    if (!existing) {
      return res.status(404).json({
        error: `Plot ${req.params.id} not found`
      });
    }

    if (!name || !soil) {
      return res.status(400).json({
        error: 'Name and soil are required'
      });
    }

    await db.run(
      'UPDATE plots SET name = ?, soil = ? WHERE id = ?',
      [name, soil, req.params.id]
    );

    const updated = await db.get(
      'SELECT * FROM plots WHERE id = ?',
      [req.params.id]
    );

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE plot
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDb();

    const result = await db.run(
      'DELETE FROM plots WHERE id = ?',
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        error: `Plot ${req.params.id} not found`
      });
    }

    res.status(200).json({
      message: `Plot ${req.params.id} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
