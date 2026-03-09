const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ---- USERS ----
// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = search ? { $or: [{ username: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const users = await User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/users/:id/ban
router.patch('/users/:id/ban', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot ban admin' });
    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ user, message: user.isBanned ? 'User banned' : 'User unbanned' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- MOVIES ----
// GET /api/admin/movies
router.get('/movies', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const movies = await Movie.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('addedBy', 'username');
    const total = await Movie.countDocuments();
    res.json({ movies, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/movies
router.post('/movies', async (req, res) => {
  try {
    const { title, posterUrl, description, tmdbId, releaseDate, trailerUrl, genre, category, rating } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const movie = await Movie.create({
      title, posterUrl, description, tmdbId, releaseDate, trailerUrl,
      genre: genre || [], category: category || 'movie', rating: rating || 0,
      addedBy: req.user._id
    });
    res.status(201).json({ movie });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/movies/:id
router.put('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ movie });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/movies/:id
router.delete('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalMovies, bannedUsers] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      User.countDocuments({ isBanned: true })
    ]);
    res.json({ totalUsers, totalMovies, bannedUsers, activeUsers: totalUsers - bannedUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
