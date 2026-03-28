# 🌾 Precision Agriculture Yield Prediction Platform

An AI-powered mobile application that predicts crop yield using Machine Learning, helping Indian farmers make data-driven decisions to improve agricultural productivity.

![AgriYield App](screenshots/home_screen.png)

---

## 📱 App Screenshots

| Home Screen | Input Screen | Result Screen |
|---|---|---|
| ![Home](screenshots/home_screen.png) | ![Input](screenshots/input_screen.png) | ![Result](screenshots/result_screen.png) |

---

## 🎯 Features

- 🌱 **AI Yield Prediction** — Predicts crop yield with 92% accuracy
- 📊 **Smart Suggestions** — Personalized farming advice based on inputs
- 💧 **Irrigation Advice** — Water management recommendations
- 🪨 **Soil Analysis** — Soil-specific improvement tips
- 🧪 **Fertilizer Guide** — Optimal fertilizer usage recommendations
- 🌱 **Crop Recommendations** — Best crop suggestions for conditions

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native + Expo |
| Backend API | Python Flask |
| ML Model | Scikit-learn (Random Forest) |
| Language | JavaScript + Python |

---

## 🧠 ML Model Performance

| Metric | Value |
|---|---|
| Algorithm | Random Forest Regressor |
| Training Samples | 800 |
| Testing Samples | 200 |
| R² Score | 0.92 (92% accurate) |
| Mean Absolute Error | 0.52 tons |

---

## 📁 Project Structure
```
precision-agriculture-yield-prediction/
│
├── 📁 ml_model/
│   ├── train_model.py      ← ML model training code
│   ├── model.pkl           ← Trained model
│   └── columns.pkl         ← Feature columns
│
├── 📁 backend/
│   ├── app.py              ← Flask REST API
│   └── requirements.txt    ← Python dependencies
│
├── 📁 mobile_app/
│   └── src/app/index.tsx   ← Main app code
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
pip install pandas scikit-learn numpy flask flask-cors
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

1. **Farmer enters data** — Crop type, soil type, rainfall, temperature, fertilizer, area
2. **Flask API receives data** — Sends to ML model
3. **ML Model predicts** — Random Forest calculates expected yield
4. **Smart suggestions generated** — App gives personalized farming advice
5. **Results displayed** — Yield prediction + improvement tips shown

---

## 📊 Input Parameters

| Parameter | Description | Unit |
|---|---|---|
| Crop Type | Type of crop being grown | Category |
| Soil Type | Type of soil on farm | Category |
| Rainfall | Annual rainfall | mm |
| Temperature | Average temperature | °C |
| Fertilizer | Fertilizer usage | kg |
| Pesticide | Pesticide usage | kg |
| Farm Area | Total farm area | hectares |

---

## 👩‍💻 Developer

**Mehak** — Precision Agriculture AI Project

> *"Built to empower Indian farmers with AI-driven insights for better yield and sustainable farming."*

---

## 📌 Future Improvements

- [ ] Real sensor data integration
- [ ] Weather API integration
- [ ] Multi-language support (Hindi, Marathi)
- [ ] Offline mode for rural areas
- [ ] Government scheme recommendations