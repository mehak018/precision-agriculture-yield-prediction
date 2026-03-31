# ============================================
# Precision Agriculture Yield Prediction Model
# Upgraded: Gradient Boosting + More Features
# Author: mehak018
# ============================================

import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler
import pickle
import os

np.random.seed(42)
n_samples = 2000

# ============================================
# STEP 1: Enhanced Dataset with More Features
# ============================================

data = {
    'crop_type':        np.random.choice(['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton'], n_samples),
    'soil_type':        np.random.choice(['Sandy', 'Clay', 'Loamy', 'Silt', 'Peaty'], n_samples),
    'rainfall_mm':      np.random.uniform(200, 1500, n_samples),
    'temperature_c':    np.random.uniform(15, 40, n_samples),
    'fertilizer_kg':    np.random.uniform(50, 300, n_samples),
    'pesticide_kg':     np.random.uniform(1, 20, n_samples),
    'area_hectares':    np.random.uniform(1, 50, n_samples),
    # New features
    'humidity_percent': np.random.uniform(30, 90, n_samples),
    'soil_ph':          np.random.uniform(5.0, 8.5, n_samples),
    'nitrogen_level':   np.random.uniform(10, 100, n_samples),
    'phosphorus_level': np.random.uniform(5, 80, n_samples),
    'potassium_level':  np.random.uniform(10, 90, n_samples),
    'planting_month':   np.random.randint(1, 13, n_samples),
    'irrigation_count': np.random.randint(0, 20, n_samples),
}

df = pd.DataFrame(data)

# Realistic yield calculation
df['yield_tons'] = (
    df['rainfall_mm'] * 0.003 +
    df['fertilizer_kg'] * 0.02 +
    df['area_hectares'] * 0.1 -
    df['temperature_c'] * 0.05 +
    df['nitrogen_level'] * 0.03 +
    df['irrigation_count'] * 0.1 +
    df['humidity_percent'] * 0.02 +
    np.random.normal(0, 0.5, n_samples)
)
df['yield_tons'] = df['yield_tons'].clip(lower=0.5)

print("✅ Enhanced dataset created!")
print(df.head())
print(f"\nDataset shape: {df.shape}")

# ============================================
# STEP 2: Prepare Data
# ============================================

df_encoded = pd.get_dummies(df, columns=['crop_type', 'soil_type'])

X = df_encoded.drop('yield_tons', axis=1)
y = df_encoded['yield_tons']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\n✅ Training samples: {len(X_train)}")
print(f"✅ Testing samples:  {len(X_test)}")

# ============================================
# STEP 3: Train Gradient Boosting Model
# ============================================

print("\n🔄 Training Gradient Boosting model...")

model = GradientBoostingRegressor(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)
model.fit(X_train, y_train)
print("✅ Gradient Boosting model trained!")

# ============================================
# STEP 4: Compare with Random Forest
# ============================================

rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

gb_predictions = model.predict(X_test)
rf_predictions = rf_model.predict(X_test)

gb_r2  = r2_score(y_test, gb_predictions)
rf_r2  = r2_score(y_test, rf_predictions)
gb_mae = mean_absolute_error(y_test, gb_predictions)
rf_mae = mean_absolute_error(y_test, rf_predictions)

print(f"\n📊 Model Comparison:")
print(f"   Gradient Boosting R²  : {gb_r2:.2f}")
print(f"   Random Forest R²      : {rf_r2:.2f}")
print(f"   Gradient Boosting MAE : {gb_mae:.2f} tons")
print(f"   Random Forest MAE     : {rf_mae:.2f} tons")

# ============================================
# STEP 5: Save Best Model
# ============================================

os.makedirs('ml_model', exist_ok=True)

with open('ml_model/model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('ml_model/columns.pkl', 'wb') as f:
    pickle.dump(list(X.columns), f)

# Save historical data for dashboard
df.to_csv('ml_model/historical_data.csv', index=False)

print("\n✅ Gradient Boosting model saved!")
print("✅ Historical data saved!")
print("\n🎉 Upgraded ML Model is ready!")