# ============================================
# Precision Agriculture Yield Prediction Model
# Author: mehak018
# ============================================

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os

# ============================================
# STEP 1: Create Sample Dataset
# (In real world, this comes from farmers/sensors)
# ============================================

np.random.seed(42)
n_samples = 1000

data = {
    'crop_type':      np.random.choice(['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton'], n_samples),
    'soil_type':      np.random.choice(['Sandy', 'Clay', 'Loamy', 'Silt', 'Peaty'], n_samples),
    'rainfall_mm':    np.random.uniform(200, 1500, n_samples),
    'temperature_c':  np.random.uniform(15, 40, n_samples),
    'fertilizer_kg':  np.random.uniform(50, 300, n_samples),
    'pesticide_kg':   np.random.uniform(1, 20, n_samples),
    'area_hectares':  np.random.uniform(1, 50, n_samples),
}

df = pd.DataFrame(data)

# Generate realistic yield based on inputs
df['yield_tons'] = (
    df['rainfall_mm'] * 0.003 +
    df['fertilizer_kg'] * 0.02 +
    df['area_hectares'] * 0.1 -
    df['temperature_c'] * 0.05 +
    np.random.normal(0, 0.5, n_samples)
)
df['yield_tons'] = df['yield_tons'].clip(lower=0.5)

print("✅ Dataset created!")
print(df.head())
print(f"\nDataset shape: {df.shape}")

# ============================================
# STEP 2: Prepare Data for ML
# ============================================

# Convert text columns to numbers (ML needs numbers)
df_encoded = pd.get_dummies(df, columns=['crop_type', 'soil_type'])

X = df_encoded.drop('yield_tons', axis=1)
y = df_encoded['yield_tons']

# Split into training and testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\n✅ Training samples: {len(X_train)}")
print(f"✅ Testing samples:  {len(X_test)}")

# ============================================
# STEP 3: Train the ML Model
# ============================================

print("\n🔄 Training model...")

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)
model.fit(X_train, y_train)

print("✅ Model trained!")

# ============================================
# STEP 4: Test the Model
# ============================================

predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
r2  = r2_score(y_test, predictions)

print(f"\n📊 Model Performance:")
print(f"   Mean Absolute Error : {mae:.2f} tons")
print(f"   R² Score            : {r2:.2f} (1.0 = perfect)")

# ============================================
# STEP 5: Save the Model
# ============================================

os.makedirs('ml_model', exist_ok=True)

with open('ml_model/model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('ml_model/columns.pkl', 'wb') as f:
    pickle.dump(list(X.columns), f)

print("\n✅ Model saved as ml_model/model.pkl")
print("✅ Columns saved as ml_model/columns.pkl")
print("\n🎉 ML Model is ready!")