# I'm Safe - Women's Safety Web App

## 🚀 Overview
I'm Safe is a web application designed to enhance women's safety by providing a **real-time safety heatmap** based on crime reports. Users can track their live location and assess the safety score of their surroundings, allowing them to make informed decisions while traveling.

## 🌟 Features
- **Real-time Safety Heatmap** 📍
  - Visualizes crime-prone areas with a heatmap.
  - Fetches crime data specific to the user's location.
- **Dynamic Safety Scoring System** 🔢
  - Assigns a safety score based on crime rates.
  - Alerts users when entering a high-risk area.
- **Live Location Tracking** 🚶
  - Displays the user's current location on the map.
  - Updates safety data as the user moves.
- **Safe Zones Marking** 🏛️
  - Highlights nearby safe locations (police stations, hospitals, etc.).
- **Crime Data Integration** 📊
  - Uses APIs (Google Places, CrimeCheck, etc.) to gather crime reports.

## 📥 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/arushree16/imsafe.git
cd imsafe
```

### 2️⃣ Install Dependencies
Ensure you have Node.js and Python installed, then run:
```bash
npm install
pip install -r requirements.txt
```

### 3️⃣ Set Up API Keys
- Obtain API keys for Google Places, CrimeCheck API, etc.
- Add them to an `.env` file:
```env
GOOGLE_PLACES_API_KEY=your_key_here
CRIMECHECK_API_KEY=your_key_here
```

### 4️⃣ Start the Application
Run the backend Python server:
```bash
python app.py
```
Then, start the frontend:
```bash
npm start
```
This will launch the web app in your browser.

## 🛠 Tech Stack
- **Frontend:** HTML, CSS, JavaScript, Leaflet.js
- **Backend:** Python (Flask), Node.js, Express
- **APIs Used:** Google Places API, CrimeCheck API

## 🤝 Contribution
1. **Fork** the repository.
2. **Create a new branch** (`feature-branch-name`).
3. **Commit** changes and push to your fork.
4. **Submit a Pull Request (PR)** for review.

## 📜 License
MIT License. Feel free to use and modify the code.

## 📩 Contact
For queries or collaborations, reach out at [your email/contact].

---
### 🌍 Stay Safe, Stay Aware!

