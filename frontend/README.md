# Listify

Listify is a mobile application built with Expo and React Native that allows users to rate music albums and share their ratings with friends. Discover new music through a feed of your friends' activity and see what's trending.

## Key Features

- **Social Music Rating:** Rate your favorite albums and see what your friends are listening to and rating.
- **Authentication:** Secure login with email/password or use social providers like Spotify, Google, and Apple for a seamless experience.
- **Dynamic Homepage:** Features a prominent album for rating, a feed of friends' recent ratings, and a section for trending music.
- **Customizable Themes:** Choose from several color themes (Green, Blue, Purple, Red) to personalize your app experience.
- **Cross-Platform:** Built with Expo to run on iOS, Android, and the web from a single codebase.

## Tech Stack

- **Framework:** React Native, Expo
- **Routing:** Expo Router
- **Navigation:** React Navigation
- **Language:** TypeScript & JavaScript (JSX)
- **Styling:** React Native StyleSheet
- **Linting:** ESLint

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- Node.js
- npm (or yarn/pnpm)
- Expo Go app on your mobile device (optional, for physical device testing)

### Installation & Launch

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/eyoaladmasu2217/listify.git
    cd listify
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npx expo start
    ```

This will open the Expo developer tools in your browser. You can then choose to run the app in:
- An Android emulator
- An iOS simulator
- A web browser
- The Expo Go app on your physical device (by scanning the QR code)

## Available Scripts

In the project directory, you can run the following commands:

-   `npm start`: Runs the app in development mode using the Expo CLI.
-   `npm run android`: Runs the app on a connected Android device or emulator.
-   `npm run ios`: Runs the app on the iOS simulator.
-   `npm run web`: Runs the app in a web browser.
-   `npm run lint`: Lints the project files using ESLint.
-   `npm run reset-project`: Resets the project to a blank Expo starter template, moving the existing example files to an `app-example` directory.

## Project Structure

-   `app/`: Contains all screens and routes for the application, using Expo's file-based routing.
    -   `login.jsx`: The authentication screen with social login options.
    -   `homepage.jsx`: The main screen after logging in, displaying album ratings and social feeds.
-   `assets/`: Stores static assets like images, icons, and fonts.
-   `constants/`: Includes application-wide constants, such as color palettes and theme configurations (`theme.ts`).
-   `hooks/`: Home for custom React hooks used throughout the app, like `useThemeColor` for handling dynamic theming.
-   `scripts/`: Contains helper scripts for project management, such as `reset-project.js`.
