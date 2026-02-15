# 🎵 Listify

**Listify** is a social music discovery platform that redefines how you track, rate, and share your favorite tunes. Built with a robust **Ruby on Rails** backend and a polished **React Native (Expo)** frontend, Listify bridges the gap between personal music curation and social connection.

Stop losing music recommendations in random chat threads. **Listify is the dedicated space for the music that matters.**

---

## ✨ Key Features

- **📱 Premium Mobile Experience**
  - **Tactile Interactions:** Integrated **Haptic Feedback** for a responsive, physical feel on every action.
  - **Fluid Animations:** Smooth layout transitions and skeleton loading states for a seamless user experience.
  - **Modern UI:** Features **Gradient Buttons**, Glassmorphism elements, and a dark-mode-first aesthetic.

- **🎧 Comprehensive Discovery**
  - **Trending Feed:** Real-time updates on the hottest songs and albums.
  - **Social Graph:** Follow friends and influencers to see their latest reviews and activities on your home feed.
  - **Search:** Instant search across a vast library of songs, albums, and artists.

- **📝 Reviews & Ratings**
  - **Deep Reviews:** Rate albums on a 5-star scale and write detailed reviews.
  - **Community Feedback:** Like and comment on reviews to engage with the community.
  - **Toast Notifications:** Non-intrusive, verified feedback for all your interactions.

- **Example Lists & Collections**
  - **Curate:** Create public or private lists (e.g., "Late Night Vibes", "Gym Hits").
  - **Manage:** Easily add songs to your collections with a single tap.

---

## 🛠️ Tech Stack

### **Frontend (Mobile)**
- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation:** Expo Router (File-based routing)
- **Styling:** React Native StyleSheet & Custom Design System
- **State Management:** React Context API (Auth, Theme, Toast)
- **Key Libraries:**
  - `expo-haptics`: For tactile feedback.
  - `expo-image`: for optimized caching and performance.
  - `expo-linear-gradient`: For advanced UI styling.
  - `axios`: For robust API communication.

### **Backend (API)**
- **Framework:** [Ruby on Rails](https://rubyonrails.org/) (API Mode)
- **Database:** SQLite (Development) / PostgreSQL (Production ready)
- **Authentication:** Custom JWT-based authentication.
- **Architecture:** RESTful API design serving JSON data.

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm/yarn
- Ruby & Rails (for backend)
- Expo Go app on your phone (or an emulator)

### Installation

#### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/eyoaladmasu2217/listify.git
cd listify/listify-backend

# Install dependencies
bundle install

# Setup Database
rails db:create db:migrate db:seed

# Run the Server (bind to 0.0.0.0 for Expo access)
rails s -b 0.0.0.0
```

#### 2. Frontend Setup
```bash
# Navigate to app directory
cd listify

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

---

## 📸 Screenshots

| Home Feed | Song Detail | Review Flow |
|:---:|:---:|:---:|
| <img src="./assets/screenshots/home.png" width="200" alt="Home Feed" /> | <img src="./assets/screenshots/detail.png" width="200" alt="Song Detail" /> | <img src="./assets/screenshots/review.png" width="200" alt="Review Flow" /> |

*(Note: Add your screenshots to an `assets/screenshots` folder to display them here)*

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
