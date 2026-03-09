const express = require('express');
const router = express.Router();
const WatchHistory = require('../models/WatchHistory');
const { protect } = require('../middleware/auth');

// GET /api/history
router.get('/', protect, async (req, res) => {
  try {
    const history = await WatchHistory.find({ user: req.user._id })
      .sort({ watchedAt: -1 })
      .limit(50);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/history - add to history (upsert)
router.post('/', protect, async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, overview, rating, releaseDate } = req.body;

    // Remove old entry if exists, then add fresh one at top
    await WatchHistory.findOneAndDelete({ user: req.user._id, tmdbId });

    const entry = await WatchHistory.create({
      user: req.user._id, tmdbId, mediaType, title, posterPath, overview, rating, releaseDate
    });

    // Keep only last 50
    const count = await WatchHistory.countDocuments({ user: req.user._id });
    if (count > 50) {
      const oldest = await WatchHistory.find({ user: req.user._id })
        .sort({ watchedAt: 1 })
        .limit(count - 50);
      await WatchHistory.deleteMany({ _id: { $in: oldest.map(h => h._id) } });
    }

    res.status(201).json({ entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/history - clear all history
router.delete('/', protect, async (req, res) => {
  try {
    await WatchHistory.deleteMany({ user: req.user._id });
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
