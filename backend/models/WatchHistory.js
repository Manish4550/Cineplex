const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: String, required: true },
  mediaType: { type: String, enum: ['movie', 'tv', 'person'], default: 'movie' },
  title: { type: String, required: true },
  posterPath: { type: String, default: '' },
  overview: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  releaseDate: { type: String, default: '' },
  watchedAt: { type: Date, default: Date.now }
});

// Keep only 50 most recent per user
watchHistorySchema.index({ user: 1, watchedAt: -1 });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
