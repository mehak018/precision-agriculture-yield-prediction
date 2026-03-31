# ============================================
# Precision Agriculture Yield Prediction API
# ============================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os
import requests

app = Flask(__name__)   # ← app is created HERE
CORS(app)

# OpenWeatherMap API
WEATHER_API_KEY = "3312151d2cfd5f141021d224e1297318"
WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather"

# ── Load ML Model ──
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, 'ml_model', 'model.pkl'), 'rb') as f:
    model = pickle.load(f)

with open(os.path.join(BASE_DIR, 'ml_model', 'columns.pkl'), 'rb') as f:
    model_columns = pickle.load(f)

print("✅ Model loaded successfully!")

# ── HOME ROUTE ──
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Precision Agriculture Yield Prediction API",
        "status": "running",
        "version": "1.0"
    })

# ── WEATHER ROUTE ──
@app.route('/weather', methods=['GET'])
def get_weather():
    try:
        city = request.args.get('city', 'Solapur')
        response = requests.get(WEATHER_URL, params={
            'q': city,
            'appid': WEATHER_API_KEY,
            'units': 'metric'
        })
        data = response.json()
        return jsonify({
            "success": True,
            "city": city,
            "temperature": data['main']['temp'],
            "humidity": data['main']['humidity'],
            "rainfall": data.get('rain', {}).get('1h', 0),
            "description": data['weather'][0]['description'],
            "wind_speed": data['wind']['speed']
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# ── PREDICT ROUTE ──
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        crop_type     = data['crop_type']
        soil_type     = data['soil_type']
        rainfall_mm   = float(data['rainfall_mm'])
        temperature_c = float(data['temperature_c'])
        fertilizer_kg = float(data['fertilizer_kg'])
        pesticide_kg  = float(data['pesticide_kg'])
        area_hectares = float(data['area_hectares'])

        input_data = {
            'rainfall_mm':   [rainfall_mm],
            'temperature_c': [temperature_c],
            'fertilizer_kg': [fertilizer_kg],
            'pesticide_kg':  [pesticide_kg],
            'area_hectares': [area_hectares],
        }

        for crop in ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton']:
            input_data[f'crop_type_{crop}'] = [1 if crop_type == crop else 0]

        for soil in ['Sandy', 'Clay', 'Loamy', 'Silt', 'Peaty']:
            input_data[f'soil_type_{soil}'] = [1 if soil_type == soil else 0]

        input_df = pd.DataFrame(input_data)
        input_df = input_df.reindex(columns=model_columns, fill_value=0)

        prediction = model.predict(input_df)[0]
        prediction = round(float(prediction), 2)

        if prediction < 2:
            advice = "Low yield expected. Consider improving soil quality and increasing fertilizer."
        elif prediction < 5:
            advice = "Moderate yield expected. Maintain current farming practices."
        else:
            advice = "Excellent yield expected! Your farming conditions are great."

        return jsonify({
            "success": True,
            "predicted_yield_tons": prediction,
            "advice": advice,
            "crop_type": crop_type,
            "area_hectares": area_hectares
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# ── RUN ──
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)