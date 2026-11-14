
const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// GET all gardeners
router.get('/', async (req, res, next) => {
  try {
    const db = await getDb();
    const gardeners = await db.all(
      'SELECT * FROM gardeners ORDER BY id ASC'
    );
    res.status(200).json(gardeners);
  } catch (error) {
    next(error);
  }
});

// GET gardener by ID
router.get('/:id', async (req, res, next) => {
  try {
    const db = await getDb();
    const gardener = await db.get(
      'SELECT * FROM gardeners WHERE id = ?',
      [req.params.id]
    );

    if (!gardener) {
      return res.status(404).json({
        error: `Gardener ${req.params.id} not found`
      });
    }

    res.status(200).json(gardener);
  } catch (error) {
    next(error);
  }
});

// POST create gardener
router.post('/', async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required'
      });
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO gardeners (name, email) VALUES (?, ?)',
      [name, email]
    );

    const created = await db.get(
      'SELECT * FROM gardeners WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json(created);
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({
        error: 'A gardener with that email already exists'
      });
    }
    next(error);
  }
});

// PUT update gardener
router.put('/:id', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const db = await getDb();

    const existing = await db.get(
      'SELECT * FROM gardeners WHERE id = ?',
      [req.params.id]
    );

    if (!existing) {
      return res.status(404).json({
        error: `Gardener ${req.params.id} not found`
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required'
      });
    }

    await db.run(
      'UPDATE gardeners SET name = ?, email = ? WHERE id = ?',
      [name, email, req.params.id]
    );

    const updated = await db.get(
      'SELECT * FROM gardeners WHERE id = ?',
      [req.params.id]
    );

    res.status(200).json(updated);
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({
        error: 'A gardener with that email already exists'
      });
    }
    next(error);
  }
});

// DELETE gardener
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDb();

    const result = await db.run(
      'DELETE FROM gardeners WHERE id = ?',
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        error: `Gardener ${req.params.id} not found`
      });
    }

    res.status(200).json({
      message: `Gardener ${req.params.id} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
