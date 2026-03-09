const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET /api/movies/custom - get admin-added custom movies
router.get('/custom', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const movies = await Movie.find(filter)
      .populate('addedBy', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Movie.countDocuments(filter);
    res.json({ movies, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/movies/custom/:id
router.get('/custom/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('addedBy', 'username');
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ movie });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
