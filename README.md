# 🎬 CinePlex — Full-Stack Movie Discovery Platform

A production-grade movie platform built with React, Redux Toolkit, Node.js, Express, and MongoDB. Integrates with the **TMDB API** for rich movie data.

---

Live Link :- https://cineplex-frontend.onrender.com/

## 🚀 Features

### Frontend
- 🎬 **Movie Discovery** — Trending, Popular Movies, Popular TV Shows
- 🔍 **Real-Time Search** — Debounced search across movies, TV shows & people
- ▶️ **Trailer Player** — YouTube trailer modal with graceful fallback
- ♥️ **Favorites** — Save/remove favorites (synced to backend)
- 🕐 **Watch History** — Auto-tracked when viewing movie pages or trailers
- 📱 **Responsive Design** — Optimized for desktop, tablet, and mobile
- ♾️ **Infinite Scroll** — Load more content as you scroll
- ⚡ **Skeleton Loading** — Smooth loading states throughout
- 🎞️ **Actor Profiles** — View person details and filmography

### Backend
- 🔐 **JWT Authentication** — Register, login, persistent sessions
- ❤️ **Favorites API** — CRUD operations for user favorites
- 📜 **Watch History API** — Auto-manage up to 50 recent entries
- 🎬 **Custom Movies** — Admin can add custom movies to platform
- 👑 **Admin Dashboard** — Manage movies and users

### Admin Panel
- ➕ Add / ✏️ Edit / 🗑️ Delete custom movies
- 👥 View all users with search
- 🚫 Ban/unban users
- 📊 Platform statistics dashboard
- All movie fields: title, poster URL, description, TMDB ID, release date, YouTube trailer key, genre, category, rating

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React Router 6 |
| State Management | Redux Toolkit with async thunks |
| API Client | Axios with JWT interceptors |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (7-day tokens, bcrypt hashing) |
| Movie Data | TMDB API (The Movie Database) |
| Fonts | Bebas Neue (display), DM Sans (body) |

---

## 📁 Project Structure

```
cineplex/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx    # Navigation with search
│   │   │   ├── MovieCard.jsx # Movie card with favorite toggle
│   │   │   ├── Skeleton.jsx  # Loading states
│   │   │   ├── TrailerModal.jsx # YouTube trailer modal
│   │   │   └── Toast.jsx     # Notifications
│   │   ├── pages/
│   │   │   ├── Home.jsx      # Hero + trending sections
│   │   │   ├── MoviesPage.jsx # Infinite scroll movies
│   │   │   ├── TVPage.jsx    # Infinite scroll TV
│   │   │   ├── SearchPage.jsx # Debounced real-time search
│   │   │   ├── DetailPage.jsx # Movie/TV detail + cast
│   │   │   ├── PersonPage.jsx # Actor profile
│   │   │   ├── FavoritesPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── AdminPage.jsx # Admin dashboard
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── moviesSlice.js
│   │   │   ├── favoritesSlice.js
│   │   │   ├── historySlice.js
│   │   │   └── uiSlice.js
│   │   ├── hooks/index.js    # useDebounce, useInfiniteScroll
│   │   └── utils/
│   │       ├── api.js        # Axios + JWT interceptors
│   │       └── tmdb.js       # TMDB API client + helpers
│   └── index.html
│
└── backend/
    ├── models/
    │   ├── User.js
    │   ├── Movie.js
    │   ├── Favorite.js
    │   └── WatchHistory.js
    ├── routes/
    │   ├── auth.js      # /api/auth
    │   ├── movies.js    # /api/movies
    │   ├── favorites.js # /api/favorites
    │   ├── history.js   # /api/history
    │   └── admin.js     # /api/admin
    ├── middleware/
    │   └── auth.js      # JWT protect + adminOnly
    └── server.js
```

---

## ⚙️ Setup & Installation

### 1. Get TMDB API Key
1. Sign up at [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Go to Settings → API → Request API Key
3. Copy your API key (v3 auth)

### 2. Clone & Install

```bash
# Install all dependencies
npm run install:all

# Or separately:
cd backend && npm install
cd frontend && npm install
```

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cineplex
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

### 4. Start MongoDB
```bash
mongod
# or use MongoDB Atlas (update MONGO_URI accordingly)
```

### 5. Run the App

```bash
# Run both servers simultaneously (from root)
npm install  # installs concurrently
npm run dev

# Or separately:
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:5173
```

---

## 🔑 Creating an Admin User

After registering, manually update a user's role in MongoDB:

```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## 📡 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user (protected) |

### Movies (Custom)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/movies/custom` | List admin-added movies |
| GET | `/api/movies/custom/:id` | Get one custom movie |

### Favorites (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/favorites` | Get user favorites |
| POST | `/api/favorites` | Add to favorites |
| DELETE | `/api/favorites/:tmdbId` | Remove from favorites |
| GET | `/api/favorites/check/:tmdbId` | Check if favorited |

### History (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/history` | Get watch history |
| POST | `/api/history` | Add to history |
| DELETE | `/api/history` | Clear all history |

### Admin (Admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/movies` | List all custom movies |
| POST | `/api/admin/movies` | Add movie |
| PUT | `/api/admin/movies/:id` | Update movie |
| DELETE | `/api/admin/movies/:id` | Delete movie |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/ban` | Toggle ban |
| DELETE | `/api/admin/users/:id` | Delete user |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#080b14` (deep cinematic dark) |
| Cards | `#111827` |
| Gold Accent | `#f5c518` (IMDb-inspired) |
| Red Accent | `#e50914` (Netflix-inspired) |
| Display Font | Bebas Neue |
| Body Font | DM Sans |
| Mono Font | JetBrains Mono |

---

## 🔧 Key Implementation Details

### Debouncing (Search)
```js
// hooks/index.js
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}
```

### Infinite Scroll
```js
export const useInfiniteScroll = (callback, hasMore) => {
  const observerRef = useRef(null)
  const sentinelRef = useCallback((node) => {
    if (!node) return
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) callback()
    })
    observerRef.current.observe(node)
  }, [callback, hasMore])
  return sentinelRef
}
```

### Error Handling
- Missing poster → placeholder shown via `onError` handler
- Missing description → `"Description not available"` shown
- Missing trailer → `"Trailer for this movie is currently unavailable"` in modal
- 401 errors → auto redirect to login
- API errors → toast notifications

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```

### Backend (Railway / Render)
```bash
cd backend
# Set env vars in dashboard
# Deploy via GitHub or CLI
```

### MongoDB
Use [MongoDB Atlas](https://www.mongodb.com/atlas) free tier for production.
