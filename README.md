# ⚡ ProPulse — Smart Protein & Gym Performance Hub

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An intelligent, multi-platform web application that eliminates manual nutrition typing.**  
*Track your protein effortlessly using AI Plate Photo Recognition, Live Barcode Scanning, and USDA Database Search — paired with an Anabolic Gym Recovery Tracker.*

[Key Features](#-key-features) • [Quickstart](#-quickstart-guide) • [AI & API Setup](#-api--privacy-details) • [Tech Stack](#-tech-stack)

</div>

---

## 📸 Overview

Traditional fitness trackers require tedious manual logging and guessing protein amounts. **ProPulse** automates the entire process:

```
+-----------------------------------------------------------------------------------+
|                              HOW IT WORKS                                         |
+-----------------------------------------------------------------------------------+
|  📷 Snap Meal Photo   ──► AI Vision detects plate items & portions ──► Auto-Protein |
|  🏷️ Scan Barcode      ──► Open Food Facts global database lookup  ──► Auto-Protein |
|  🔍 Type Food Name    ──► USDA FoodData Central + offline catalog ──► Auto-Protein |
|  🏋️ Log Gym Session   ──► Anabolic Window & Post-Workout Guidance ──► Recovery MPS |
+-----------------------------------------------------------------------------------+
```

---

## 🌟 Key Features

### 1. 🤖 Snap Meal (AI Vision Recognition)
- Take a photo of your plate or upload an image from your device.
- **Multimodal AI (Gemini 1.5 Flash)** analyzes the image, detects each distinct food item (e.g., *160g chicken breast, 150g brown rice, 100g broccoli*), and automatically computes protein in grams per item and for the entire meal.
- Includes sports nutrition insights and advice per meal.
- *Works instantly in Demo Mode or with your own free Gemini API key.*

### 2. 🏷️ Live Camera Barcode Scanner
- Point your mobile camera or desktop webcam at any packaged food barcode.
- Real-time decoding powered by `html5-qrcode`.
- Directly interfaces with the **Open Food Facts API** (millions of products worldwide, **100% free, no API key required**).
- Fallback manual barcode digit input.

### 3. 🔍 Natural Food Search with Instant USDA Lookup
- Search any food item (*"grilled salmon"*, *"greek yogurt"*, *"boiled egg"*, *"tofu"*).
- Integrated with the official **USDA FoodData Central API**.
- Includes a built-in zero-latency offline cache of **40+ high-protein fitness staples**.
- Interactive portion adjuster (grams slider & standard serving presets) with real-time recalculation.

### 4. 🏋️ Gym & Anabolic Recovery Window Tracker
- Log workout splits: **Push, Pull, Legs, Upper Body, Lower Body, Full Body, Cardio & HIIT**.
- Exercise table tracking **Sets, Reps, and Weights (kg/lbs)** with built-in exercise database.
- **Post-Workout Recovery Indicator**: Automatically calculates optimal post-workout protein targets (e.g., *30–40g within 2 hours*) to stimulate Muscle Protein Synthesis (MPS).
- 1-click shortcut to log a post-workout shake.

### 5. 📱 PC Web & Mobile Responsive
- **Mobile-First Design**: Sticky bottom navigation bar (Overview, Food Diary, Gym, Settings) optimized for single-handed smartphone use.
- **Desktop Layout**: Elegant glassmorphic dashboard with expanded metrics.
- **Visual Progress Gauge**: Animated circular progress ring with celebratory confetti effects upon hitting your daily goal.
- **100% Local Privacy**: All logs and settings persist in browser `localStorage`. No mandatory user accounts, tracking, or cloud databases.

---

## 🚀 Quickstart Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/propulse-protein-tracker.git
cd propulse-protein-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
*(On Windows systems where PowerShell restricts scripts, run `npm.cmd run dev` or double-click `start.bat`)*

Open your browser and navigate to:
```
http://localhost:5173
```

### 4. Build for Production
```bash
npm run build
```
The compiled, production-ready static files will be generated in the `/dist` directory.

---

## 🔑 API & Privacy Details

ProPulse is designed to work immediately with **zero configuration**:

| Service | Purpose | API Key Required? | Notes |
| :--- | :--- | :--- | :--- |
| **Open Food Facts** | Barcode Lookup | ❌ **No** | Free public database of global packaged foods. |
| **USDA FoodData Central** | Keyword Food Search | ⚡ **Optional** | Pre-configured with demo access + offline staples. |
| **Google Gemini Vision** | Plate Photo Recognition | ⚡ **Optional** | Works out of the box in Demo Mode. Free key from [Google AI Studio](https://aistudio.google.com/app/apikey) can be added in Settings. |

> 🔒 **Privacy Guarantee**: All API keys and logged meals are stored strictly on your local device via `localStorage`. No data is ever sent to private third-party servers.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Barcode Scanner**: [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- **AI Multimodal Model**: Google Gemini 1.5 Flash Vision
- **Visual Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 📂 Project Structure

```
protein-intake-counter/
├── index.html              # HTML5 entry & typography
├── package.json            # Scripts & project dependencies
├── vite.config.js          # Vite & Tailwind CSS plugins
├── start.bat               # 1-Click Windows launcher
├── src/
│   ├── main.jsx            # React root mount
│   ├── App.jsx             # State orchestration & modal management
│   ├── index.css           # Tailwind v4 import & custom animations
│   ├── components/
│   │   ├── Header.jsx              # Date navigation & streak counter
│   │   ├── DailySummary.jsx        # Circular progress ring & macro metrics
│   │   ├── ActionCards.jsx         # 4 quick-action launch cards
│   │   ├── FoodSearchModal.jsx     # Debounced USDA search & portion slider
│   │   ├── PhotoAiModal.jsx        # Camera plate snapshot & AI analysis
│   │   ├── BarcodeScannerModal.jsx # Camera barcode scanner & package lookup
│   │   ├── WorkoutModal.jsx        # Gym split & exercise sets logger
│   │   ├── FoodLogList.jsx         # Grouped meal diary with delete actions
│   │   ├── WorkoutLogList.jsx      # Completed session & recovery timer
│   │   ├── SettingsModal.jsx       # Goals, body weight & API key manager
│   │   └── Navigation.jsx          # Mobile bottom bar & desktop pill tabs
│   ├── data/
│   │   ├── stapleFoods.js          # 40+ curated high-protein fitness staples
│   │   └── gymExercises.js         # Exercise splits & recovery guidelines
│   └── services/
│       ├── usdaApi.js              # USDA FoodData Central integration
│       ├── barcodeApi.js           # Open Food Facts API integration
│       └── aiVisionApi.js          # Gemini 1.5 Flash Vision analyzer
└── dist/                   # Production build distribution
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve ProPulse:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for fitness enthusiasts, athletes, and lifters.</sub>
</div>
