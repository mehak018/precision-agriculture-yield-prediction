# 🌾 Precision Agriculture Yield Prediction Platform

An AI-powered platform that predicts crop yield using Machine Learning, real-time weather data, and smart recommendations — helping Indian farmers and agricultural officials make data-driven decisions.

---

## 📱 App Screenshots

| Home Screen | Input Screen | Result Screen |
|---|---|---|
| ![Home](screenshots/home_screen.png) | ![Input](screenshots/input_screen.png) | ![Result](screenshots/result_screen.png) |

---

## 🎯 Features

### 👨‍🌾 Farmer App
- 🌾 **AI Yield Prediction** — 89% accurate Gradient Boosting model
- 🌤️ **Live Weather Integration** — Auto-fills temperature & rainfall
- 💡 **Smart Suggestions** — Personalized farming advice
- 🪨 **Soil Analysis Tips** — Soil-specific recommendations
- 🧪 **Fertilizer Guide** — Optimal usage recommendations
- 🌱 **Crop Recommendations** — Best crop for your conditions

### 🏛️ Admin Dashboard
- 📍 **District Selection** — 8 Maharashtra districts
- 🌤️ **District Weather** — Real-time weather per district
- 📊 **District Yield Report** — Total yield estimation
- 🏪 **Storage Planning** — Required storage capacity
- 💰 **Market Value** — Estimated procurement value
- 👨‍🌾 **Farmer Count** — Estimated farmers to notify

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native + Expo |
| Backend API | Python Flask |
| ML Model | Gradient Boosting (Scikit-learn) |
| Weather API | OpenWeatherMap API |
| Language | TypeScript + Python |

---

## 🧠 ML Model Performance

| Metric | Value |
|---|---|
| Algorithm | Gradient Boosting Regressor |
| Training Samples | 800 |
| Testing Samples | 200 |
| R² Score | 0.89 (89% accurate) |
| Features | Crop, Soil, Rainfall, Temperature, Fertilizer |

---

## 📁 Project Structure
```
precision-agriculture-yield-prediction/
│
├── 📁 ml_model/
│   ├── train_model.py      ← ML model training
│   ├── model.pkl           ← Trained model
│   └── columns.pkl         ← Feature columns
│
├── 📁 backend/
│   ├── app.py              ← Flask REST API
│   └── requirements.txt    ← Python dependencies
│
├── 📁 mobile_app/
│   └── src/app/
│       ├── index.tsx       ← Farmer app
│       └── admin.tsx       ← Admin dashboard
│
├── 📁 screenshots/         ← App screenshots
└── README.md
```

---

## 🚀 How to Run

### 1. Clone the Repository
```bash
git clone https://github.com/mehak018/precision-agriculture-yield-prediction.git
cd precision-agriculture-yield-prediction
```

### 2. Install Python Dependencies
```bash
pip install pandas scikit-learn numpy flask flask-cors requests
```

### 3. Train the ML Model
```bash
python ml_model/train_model.py
```

### 4. Start the Flask API
```bash
python backend/app.py
```

### 5. Run the Mobile App
```bash
cd mobile_app
npx expo start --web
```

---

## 🌾 How It Works
```
Farmer enters data
       ↓
Live weather auto-filled
       ↓
Flask API receives data
       ↓
Gradient Boosting predicts yield
       ↓
Smart suggestions generated
       ↓
Results + advice displayed
```

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | API status |
| `/predict` | POST | Yield prediction |
| `/weather?city=Solapur` | GET | Live weather data |

---

## 🔮 Future Roadmap

- [ ] CNN satellite imagery analysis
- [ ] 30-60 day advance yield prediction
- [ ] Government insurance portal integration
- [ ] Multi-language support (Hindi, Marathi)
- [ ] Offline mode for rural areas
- [ ] SMS alerts for farmers

---

## 👩‍💻 Developer

**Mehak** — Precision Agriculture AI Project
GitHub: [@mehak018](https://github.com/mehak018)

> *"Built to empower Indian farmers with AI-driven insights for better yield and sustainable farming."*