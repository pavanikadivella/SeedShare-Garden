const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');
const { parseId, validateGardener } = require('../middleware/validate');

router.get('/', async (req, res, next) => {
  try {
    const db = await getDb();
    const gardeners = await db.all('SELECT * FROM gardeners');
    res.status(200).json(gardeners);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({
      error: 'id must be a positive whole number'
    });

    const db = await getDb();
    const gardener = await db.get(
      'SELECT * FROM gardeners WHERE id = ?', [id]
    );

    if (!gardener) {
      return res.status(404).json({
        error: `Gardener ${id} not found`
      });
    }

    res.status(200).json(gardener);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const problem = validateGardener(req.body);

    if (problem) {
      return res.status(400).json({ error: problem });
    }

    const db = await getDb();

    const result = await db.run(
      'INSERT INTO gardeners (name, email) VALUES (?, ?)',
      [req.body.name.trim(), req.body.email.trim()]
    );

    const created = await db.get(
      'SELECT * FROM gardeners WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json(created);
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(409).json({
        error: 'A gardener with that email already exists'
      });
    }
    next(err);
  }
});

module.exports = router;