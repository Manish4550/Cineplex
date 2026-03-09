const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  posterUrl: { type: String, default: '' },
  description: { type: String, default: 'Description not available' },
  tmdbId: { type: String, default: '' },
  releaseDate: { type: String, default: '' },
  trailerUrl: { type: String, default: '' },
  genre: [{ type: String }],
  category: { type: String, enum: ['movie', 'tv', 'anime', 'documentary', 'other'], default: 'movie' },
  rating: { type: Number, default: 0, min: 0, max: 10 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isCustom: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

movieSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Movie', movieSchema);
