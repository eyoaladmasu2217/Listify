# Listify

Listify is a mobile application built with Expo and React Native that allows users to rate music albums and share their ratings with friends. Discover new music through a feed of your friends' activity and see what's trending.

## Key Features

- **Social Music Rating:** Rate your favorite albums and see what your friends are listening to and rating.
- **Authentication:** Secure login with email/password or use social providers like Spotify, Google, and Apple for a seamless experience.
- **Dynamic Homepage:** Features a prominent album for rating, a feed of friends' recent ratings, and a section for trending music.
- **Customizable Themes:** Choose from several color themes (Green, Blue, Brown, Red) to personalize your app experience.
- **Cross-Platform:** Built with Expo to run on iOS, Android, and the web from a single codebase.

## Tech Stack

- **Framework:** React Native, Expo
  **Backend:** Ruby on Rails
# Listify

Listify is a music discovery and social-rating application. The mobile client is implemented with Expo and React Native and pairs with a Rails-based backend located in the `listify-backend` directory. Users can create accounts, rate albums, follow other users, and view activity and trending lists.

## Contents of this repository

- `app/` — Expo/React Native application source code and route screens.
- `assets/` — Static assets (images, icons, fonts).
- `listify-backend/` — Rails application providing API, authentication, and data storage.
- `scripts/` — Utility scripts used for project maintenance.

## Key features

- User authentication (email/password + social auth integrations enabled in production).
- Create and manage album reviews with ratings and comments.
- Follow other users and view a social activity feed.
- Trending and discovery views to surface popular albums and reviews.
- Customizable color themes for the mobile client.

## Technology overview

- Frontend: Expo (SDK), React Native, React Navigation, Expo Router.
- Backend: Ruby on Rails (API), SQLite for development.
- API communication: `axios` from the client to the backend.
- Linting and types: ESLint and TypeScript type declarations where applicable.

## Getting started (development)

Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- Ruby (for backend), Bundler
- SQLite (for local Rails development) or a configured PostgreSQL instance

Frontend (client)
1. Clone the repository and change into the project root:

```bash
git clone https://github.com/eyoaladmasu2217/listify.git
cd listify
```

2. Install JavaScript dependencies:

```bash
npm install
```

3. Start the Expo development server:

```bash
npx expo start
```

Backend (API)
1. Change into the backend directory and install Ruby dependencies:

```bash
cd listify-backend
bundle install
```

2. Prepare the database and run migrations:

```bash
bundle exec rails db:create db:migrate
```

3. Run the backend test suite (if desired):

```bash
bundle exec rake test
```

Notes
- On Windows, ensure Ruby, Bundler, and a compatible SQLite or PostgreSQL client are installed and available on the PATH.

## Available npm scripts

- `npm start` — Launch Expo development server
- `npm run android` — Start and target an Android device/emulator
- `npm run ios` — Start and target an iOS simulator
- `npm run web` — Run the web build via Expo for web
- `npm run lint` — Run ESLint
- `npm run reset-project` — Move current example app files and reinitialize a starter template 

## Project structure (high level)

- `app/` — Application routes and screen components (login, register, profile, collections, reviews, etc.)
- `app/components/` — Reusable UI components (buttons, modals, skeleton loaders)
- `app/api/` — Client wrapper for API calls
- `app/context/` — React contexts: `AuthContext`, `ThemeContext`, `ToastContext`
- `listify-backend/` — Rails API, models, serializers, controllers, and test suite



## Contributing

If you plan to contribute:

- Open an issue describing the change or bug.
- Create a feature branch named `feat/<short-description>` or `fix/<short-description>`.
- Run linters and tests locally before submitting a pull request.

## Notes and known requirements

- The backend includes pending database migrations that must be applied before running the Rails test suite and server.
- Production configuration (OAuth provider keys, database credentials) is not included in this repository and must be provided via environment variables or a secrets manager.



