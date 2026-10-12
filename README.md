# Logging Dashboard (React + TypeScript)

A dedicated, modern web dashboard for searching, auditing, and inspecting transactional email logs and telemetry by **Message ID**.

## ✨ Features

- **TypeScript-First**: 100% typed with React 19, Vite, and Lucide React.
- **Message ID Investigation**: Instant search across all user-data logs, displaying chronological delivery events.
- **Dark & Light Mode**: Curated glassmorphism design system matching the FreelyEmail visual ecosystem.
- **Security-First**: Uses a server-side proxy (`vite.config.js`) so the backend's `x-logging-key` is **never** bundled into client-side browser JavaScript.
- **Interactive JSON Inspector**: 1-click copy for raw JSON payloads and Message IDs.

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   cd logging-dashboard
   npm install
   ```

2. **Run in development:**
   ```bash
   npm run dev
   ```
   Opens on `http://localhost:5174`.

3. **Build for production:**
   ```bash
   npm run build
   ```
