# AI Prompts Documentation

This document contains the AI prompts used during the development of the Anime Search App.

## API Integration

**Prompt:** "Implement API service for Jikan API v4 to search anime and fetch details. Add request cancellation to handle race conditions when users type quickly."

**Result:** Created API service layer with Axios and proper error handling.

## State Management

**Prompt:** "Set up Redux store with anime slice for managing search results, pagination, selected anime, and loading/error states. Use createAsyncThunk for API calls."

**Result:** Implemented Redux Toolkit store with typed hooks and async thunks.

## Search Feature

**Prompt:** "Build a search page with instant search using 250ms debouncing, server-side pagination, and anime cards grid. Add skeleton loaders and empty states."

**Result:** Created SearchPage component with debounced search and pagination controls. Most UI was designed and built by me and the AI only gave basic UI ideas.

## Detail Page

**Prompt:** "Create anime detail page showing comprehensive information including title, synopsis, ratings, genres, studios, and trailer link. Add AOS animations for smooth transitions."

**Result:** Implemented DetailPage with all anime metadata and animated elements. Most UI was designed and built by me and the AI only gave basic UI ideas.

## Sort & Filter Feature

**Prompt:** "Add advanced sort and filter functionality to the search page. Allow users to filter anime by genre and year, and sort results by popularity, rating, or newest. Integrate with Redux state"

**Result:** Implemented FilterPanel component with genre/year filters and sort options, connected to Redux. Updated SearchPage to apply filters and sorting in real time.

## Favorites Page Feature

**Prompt:** "Create a favorites page where users can view, manage, and remove their favorited anime. Persist favorites in localStorage and display them in a responsive grid. Integrate with Redux for state management and provide navigation back to search."

**Result:** Implemented FavoritesPage component with grid display, remove functionality and localStorage persistence. Connected to Redux and added navigation controls.

---

**Note:** All prompts were crafted to build a production-ready application following React and TypeScript best practices.
