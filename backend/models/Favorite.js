const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: String, required: true },
  mediaType: { type: String, enum: ['movie', 'tv', 'person'], default: 'movie' },
  title: { type: String, required: true },
  posterPath: { type: String, default: '' },
  overview: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  releaseDate: { type: String, default: '' },
  addedAt: { type: Date, default: Date.now }
});

favoriteSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
