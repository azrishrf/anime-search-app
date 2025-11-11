# Anime Search App

A modern, feature-rich anime search application built with React, TypeScript, Redux, and Tailwind CSS. Search through thousands of anime titles with instant results, advanced filtering and a beautiful dark/orange themed UI.

[Live Demo](https://anime-search-app-green.vercel.app/)

## 🚀 Features

### Core Features
- **Instant Search** - Real-time anime search with 250ms debouncing
- **Server-Side Pagination** - Efficient browsing through thousands of results
- **Detailed Anime Information** - Comprehensive details including scores, rankings, synopses, and more
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean dark theme (#212D3B) with orange (#F59E0B) accents

### Bonus Implementations ⭐

#### 1. Favorites System
- Add/remove anime to your personal favorites collection
- LocalStorage persistence - favorites saved across sessions
- Dedicated favorites page at `/favorites`
- Real-time favorite count badge
- Heart icons for quick favorite toggling

#### 2. Advanced Filters
- **Genre Filter** - 12 popular genres (Action, Adventure, Comedy, Drama, etc.)
- **Year Filter** - Browse anime from the last 30 years
- Slide-in filter panel with smooth animations
- Active filter count indicator
- Client-side filtering for instant results

#### 3. Sort Options
- Sort by **Popularity** - Most popular anime first
- Sort by **Rating** - Highest rated anime first
- Sort by **Newest** - Latest releases first
- Default sorting option

#### 4. Social Media Sharing
- Share anime on **Twitter/X**
- Share anime on **Facebook**
- Share anime on **WhatsApp**
- Copy link to clipboard
- Beautiful dropdown share menu

#### 5. Animations & Polish
- AOS (Animate On Scroll) library integration
- Smooth fade-in and slide-in animations
- Card hover effects with scale transitions
- Loading states with skeleton screens

## 🛠️ Tech Stack

- **React**
- **TypeScript**
- **Redux Toolkit**
- **React Router DOM**
- **Tailwind CSS**
- **Vite**
- **Axios**
- **AOS**
- **React Icons 5.4.0**
- **Jikan API v4**

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd anime-search-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:4000
```

## 🎯 Usage

### Search for Anime
1. Navigate to the search page (home)
2. Type in the search bar to find anime
3. Results appear instantly with debouncing
4. Click on any anime card to view details

### Filter & Sort
1. Click the "Filters & Sort" button
2. Select genres, year, or sort option
3. Filters apply instantly to search results
4. Clear all filters with one click

### Manage Favorites
1. Click the heart icon on any anime card
2. View all favorites by clicking "My Favorites" button
3. Navigate to `/favorites` to see your collection
4. Remove from favorites by clicking the heart again

### Share Anime
1. Go to any anime detail page
2. Click the "Share" button
3. Choose your preferred platform
4. Share with friends!

## 🌐 Routes

- `/` - Search page (home)
- `/favorites` - Favorites collection page
- `/anime/:id` - Anime detail page

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) - Free anime database API
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
