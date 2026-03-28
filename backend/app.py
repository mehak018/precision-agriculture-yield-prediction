# ============================================
# Precision Agriculture Yield Prediction API
# Author: mehak018
# ============================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Allows mobile app to talk to this API

# ============================================
# Load the trained ML model
# ============================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, 'ml_model', 'model.pkl'), 'rb') as f:
    model = pickle.load(f)

with open(os.path.join(BASE_DIR, 'ml_model', 'columns.pkl'), 'rb') as f:
    model_columns = pickle.load(f)

print("✅ Model loaded successfully!")

# ============================================
# HOME ROUTE - Just to test API is running
# ============================================

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "🌾 Precision Agriculture Yield Prediction API",
        "status": "running",
        "version": "1.0"
    })

# ============================================
# PREDICT ROUTE - Main prediction endpoint
# ============================================

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data sent from mobile app
        data = request.get_json()

        crop_type     = data['crop_type']
        soil_type     = data['soil_type']
        rainfall_mm   = float(data['rainfall_mm'])
        temperature_c = float(data['temperature_c'])
        fertilizer_kg = float(data['fertilizer_kg'])
        pesticide_kg  = float(data['pesticide_kg'])
        area_hectares = float(data['area_hectares'])

        # Build input dataframe
        input_data = {
            'rainfall_mm':   [rainfall_mm],
            'temperature_c': [temperature_c],
            'fertilizer_kg': [fertilizer_kg],
            'pesticide_kg':  [pesticide_kg],
            'area_hectares': [area_hectares],
        }

        # Add crop type columns
        for crop in ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton']:
            input_data[f'crop_type_{crop}'] = [1 if crop_type == crop else 0]

        # Add soil type columns
        for soil in ['Sandy', 'Clay', 'Loamy', 'Silt', 'Peaty']:
            input_data[f'soil_type_{soil}'] = [1 if soil_type == soil else 0]

        # Create dataframe and align columns
        input_df = pd.DataFrame(input_data)
        input_df = input_df.reindex(columns=model_columns, fill_value=0)

        # Make prediction
        prediction = model.predict(input_df)[0]
        prediction = round(float(prediction), 2)

        # Give farming advice based on prediction
        if prediction < 2:
            advice = "⚠️ Low yield expected. Consider improving soil quality and increasing fertilizer."
        elif prediction < 5:
            advice = "✅ Moderate yield expected. Maintain current farming practices."
        else:
            advice = "🌟 Excellent yield expected! Your farming conditions are great."

        return jsonify({
            "success": True,
            "predicted_yield_tons": prediction,
            "advice": advice,
            "crop_type": crop_type,
            "area_hectares": area_hectares
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

# ============================================
# RUN THE API
# ============================================

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)