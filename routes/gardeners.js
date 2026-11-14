
const express = require('express');
const router = express.Router();

// Get all gardeners
router.get('/', async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'Get all gardeners endpoint',
      data: []
    });
  } catch (error) {
    next(error);
  }
});

// Get a gardener by ID
router.get('/:id', async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'Get gardener by ID endpoint',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
});

// Create a gardener
router.post('/', async (req, res, next) => {
  try {
    res.status(201).json({
      message: 'Create gardener endpoint',
      data: req.body
    });
  } catch (error) {
    next(error);
  }
});

// Update a gardener
router.put('/:id', async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'Update gardener endpoint',
      id: req.params.id,
      data: req.body
    });
  } catch (error) {
    next(error);
  }
});

// Delete a gardener
router.delete('/:id', async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'Delete gardener endpoint',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
