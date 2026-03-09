const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const { protect } = require('../middleware/auth');

// GET /api/favorites - get user favorites
router.get('/', protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ addedAt: -1 });
    res.json({ favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/favorites - add to favorites
router.post('/', protect, async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, overview, rating, releaseDate } = req.body;
    const existing = await Favorite.findOne({ user: req.user._id, tmdbId });
    if (existing) return res.status(400).json({ message: 'Already in favorites' });

    const fav = await Favorite.create({
      user: req.user._id, tmdbId, mediaType, title, posterPath, overview, rating, releaseDate
    });
    res.status(201).json({ favorite: fav });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/favorites/:tmdbId - remove from favorites
router.delete('/:tmdbId', protect, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user._id, tmdbId: req.params.tmdbId });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/favorites/check/:tmdbId
router.get('/check/:tmdbId', protect, async (req, res) => {
  try {
    const fav = await Favorite.findOne({ user: req.user._id, tmdbId: req.params.tmdbId });
    res.json({ isFavorite: !!fav });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
