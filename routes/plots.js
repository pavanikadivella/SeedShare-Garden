const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');
const { parseId, validatePlot } = require('../middleware/validate');

// Get all plots or search by soil type
router.get('/', async (req, res, next) => {
  try {
    const db = await getDb();
    const { soil } = req.query;

    if (soil !== undefined) {
      const plots = await db.all(
        'SELECT * FROM plots WHERE LOWER(soil) LIKE ?',
        [`%${String(soil).trim().toLowerCase()}%`]
      );

      return res.status(200).json(plots);
    }

    const plots = await db.all('SELECT * FROM plots');
    res.status(200).json(plots);

  } catch (err) {
    next(err);
  }
});

// Get one plot
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: 'id must be a positive whole number'
      });
    }

    const db = await getDb();
    const plot = await db.get(
      'SELECT * FROM plots WHERE id = ?', [id]
    );

    if (!plot) {
      return res.status(404).json({
        error: `Plot ${id} not found`
      });
    }

    res.status(200).json(plot);

  } catch (err) {
    next(err);
  }
});

// Add plot with validation
router.post('/', async (req, res, next) => {
  try {
    const problem = validatePlot(req.body);

    if (problem) {
      return res.status(400).json({ error: problem });
    }

    const db = await getDb();

    const result = await db.run(
      'INSERT INTO plots (name, soil) VALUES (?, ?)',
      [req.body.name.trim(), req.body.soil.trim()]
    );

    const created = await db.get(
      'SELECT * FROM plots WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json(created);

  } catch (err) {
    next(err);
  }
});

// Update plot with validation
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: 'id must be a positive whole number'
      });
    }

    const problem = validatePlot(req.body);

    if (problem) {
      return res.status(400).json({ error: problem });
    }

    const db = await getDb();
    const existing = await db.get(
      'SELECT * FROM plots WHERE id = ?', [id]
    );

    if (!existing) {
      return res.status(404).json({
        error: `Plot ${id} not found`
      });
    }

    await db.run(
      'UPDATE plots SET name = ?, soil = ? WHERE id = ?',
      [req.body.name.trim(), req.body.soil.trim(), id]
    );

    const updated = await db.get(
      'SELECT * FROM plots WHERE id = ?', [id]
    );

    res.status(200).json(updated);

  } catch (err) {
    next(err);
  }
});

// Delete plot
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: 'id must be a positive whole number'
      });
    }

    const db = await getDb();
    const result = await db.run(
      'DELETE FROM plots WHERE id = ?', [id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        error: `Plot ${id} not found`
      });
    }

    res.status(200).json({
      message: `Plot ${id} deleted`
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;