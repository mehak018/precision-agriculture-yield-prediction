import React, { useState } from 'react';
import AdminDashboard from './admin';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity
} from 'react-native';

const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton'];
const SOILS = ['Sandy', 'Clay', 'Loamy', 'Silt', 'Peaty'];

const getSuggestions = (cropType, soilType, rainfall, temperature, fertilizer, area, predictedYield) => {
  const suggestions = [];

  if (soilType === 'Sandy') {
    suggestions.push({ icon: '🪨', category: 'Soil', tip: 'Sandy soil drains fast. Add organic compost or manure to improve water retention and nutrients.' });
  } else if (soilType === 'Clay') {
    suggestions.push({ icon: '🪨', category: 'Soil', tip: 'Clay soil gets waterlogged. Add sand and organic matter to improve drainage and aeration.' });
  } else if (soilType === 'Peaty') {
    suggestions.push({ icon: '🪨', category: 'Soil', tip: 'Peaty soil is acidic. Add lime to balance pH levels for better crop growth.' });
  } else if (soilType === 'Silt') {
    suggestions.push({ icon: '🪨', category: 'Soil', tip: 'Silt soil is fertile but prone to compaction. Avoid heavy machinery and add organic matter.' });
  } else {
    suggestions.push({ icon: '🪨', category: 'Soil', tip: 'Loamy soil is ideal! Maintain it by adding compost every season to keep nutrients high.' });
  }

  if (rainfall < 400) {
    suggestions.push({ icon: '💧', category: 'Irrigation', tip: 'Very low rainfall detected. Install drip irrigation system immediately. Consider drought-resistant crop varieties.' });
  } else if (rainfall < 700) {
    suggestions.push({ icon: '💧', category: 'Irrigation', tip: 'Moderate rainfall. Supplement with sprinkler irrigation during dry spells for consistent moisture.' });
  } else if (rainfall > 1200) {
    suggestions.push({ icon: '💧', category: 'Irrigation', tip: 'High rainfall area. Ensure proper drainage channels to prevent waterlogging and root diseases.' });
  } else {
    suggestions.push({ icon: '💧', category: 'Irrigation', tip: 'Good rainfall levels! Monitor soil moisture weekly and irrigate only when top 2 inches feel dry.' });
  }

  if (fertilizer < 100) {
    suggestions.push({ icon: '🧪', category: 'Fertilizer', tip: 'Low fertilizer usage. Increase NPK fertilizer gradually. Consider soil testing to find exact nutrient deficiencies.' });
  } else if (fertilizer > 250) {
    suggestions.push({ icon: '🧪', category: 'Fertilizer', tip: 'High fertilizer usage detected. Excess fertilizer can burn crops. Reduce by 20% and use organic alternatives.' });
  } else {
    suggestions.push({ icon: '🧪', category: 'Fertilizer', tip: 'Good fertilizer balance! Split into 3 applications: sowing, growing, and flowering stages.' });
  }

  if (temperature > 35) {
    suggestions.push({ icon: '🌡️', category: 'Temperature', tip: 'Very high temperature! Use mulching to keep soil cool. Water crops early morning or evening only.' });
  } else if (temperature < 18) {
    suggestions.push({ icon: '🌡️', category: 'Temperature', tip: 'Low temperature detected. Use plastic mulch or row covers to protect crops from cold stress.' });
  }

  if (soilType === 'Loamy' && rainfall > 600) {
    suggestions.push({ icon: '🌱', category: 'Best Crop', tip: 'Your conditions are perfect for Rice and Wheat! These crops thrive in loamy soil with good rainfall.' });
  } else if (soilType === 'Sandy' && temperature > 28) {
    suggestions.push({ icon: '🌱', category: 'Best Crop', tip: 'Consider switching to Cotton or Soybean — they perform excellently in sandy, warm conditions.' });
  } else if (soilType === 'Clay') {
    suggestions.push({ icon: '🌱', category: 'Best Crop', tip: 'Maize and Soybean grow well in clay soil. Avoid Rice as it may cause waterlogging issues.' });
  } else {
    suggestions.push({ icon: '🌱', category: 'Best Crop', tip: `${cropType} is a good choice! Rotate with legumes next season to restore soil nitrogen.` });
  }

  if (predictedYield < 2) {
    suggestions.push({ icon: '⚠️', category: 'Yield Alert', tip: 'Low yield predicted. Focus on soil health, proper irrigation, and balanced fertilization before next season.' });
  } else if (predictedYield > 6) {
    suggestions.push({ icon: '🏆', category: 'Yield Alert', tip: 'Excellent yield predicted! Consider selling surplus at government mandis for best price.' });
  }

  return suggestions;
};

export default function App() {
const [screen, setScreen] = useState('home');
const [weatherData, setWeatherData] = useState<any>(null);
const [city, setCity] = useState('Solapur');
const [weatherLoading, setWeatherLoading] = useState(false);

const fetchWeather = async () => {
  setWeatherLoading(true);
  try {
    const response = await fetch(`http://127.0.0.1:5000/weather?city=${city}`);
    const data = await response.json();
    if (data.success) {
      setWeatherData(data);
      // Auto fill temperature and rainfall
      setTemperature(String(Math.round(data.temperature)));
      setRainfall(String(Math.round(data.rainfall * 365)));
    }
  } catch (error) {
    alert('Cannot fetch weather. Check API key!');
  }
  setWeatherLoading(false);
};
  const [cropType, setCropType] = useState('Wheat');
  const [soilType, setSoilType] = useState('Loamy');
  const [rainfall, setRainfall] = useState('');
  const [temperature, setTemperature] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const [pesticide, setPesticide] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePredict = async () => {
    if (!rainfall || !temperature || !fertilizer || !pesticide || !area) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_type: cropType,
          soil_type: soilType,
          rainfall_mm: parseFloat(rainfall),
          temperature_c: parseFloat(temperature),
          fertilizer_kg: parseFloat(fertilizer),
          pesticide_kg: parseFloat(pesticide),
          area_hectares: parseFloat(area),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data);
        setScreen('result');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Cannot connect to Flask API! Make sure it is running.');
    }
    setLoading(false);
  };

  // HOME SCREEN
  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🌾</Text>
        <Text style={styles.title}>AgriYield</Text>
        <Text style={styles.subtitle}>
          Precision Agriculture{'\n'}Yield Prediction Platform
        </Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>🌱 Predict crop yield using AI</Text>
          <Text style={styles.infoText}>📊 92% accurate ML model</Text>
          <Text style={styles.infoText}>🚜 Built for Indian farmers</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setScreen('input')}>
          <Text style={styles.buttonText}>Start Prediction →</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.buttonOutline}
  onPress={() => setScreen('admin')}
>
  <Text style={styles.buttonOutlineText}>🏛️ Admin Dashboard</Text>
</TouchableOpacity>
        <Text style={styles.footer}>Made by Mehak | Precision Agriculture AI</Text>
      </View>
    );
  }

  // INPUT SCREEN
  if (screen === 'input') {
    return (
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.heading}>🌱 Farm Details</Text>

        {/* Weather Card */}
        <View style={styles.weatherBox}>
          <Text style={styles.weatherTitle}>🌤️ Get Weather Data</Text>
          <View style={styles.weatherRow}>
            <TextInput
              style={styles.weatherInput}
              placeholder="Enter city name"
              value={city}
              onChangeText={setCity}
            />
            <TouchableOpacity
              style={styles.weatherButton}
              onPress={fetchWeather}
              disabled={weatherLoading}
            >
              <Text style={styles.weatherButtonText}>
                {weatherLoading ? '...' : 'Fetch'}
              </Text>
            </TouchableOpacity>
          </View>
          {weatherData && (
            <View style={styles.weatherResult}>
              <Text style={styles.weatherInfo}>🌡️ Temp: {weatherData.temperature}°C</Text>
              <Text style={styles.weatherInfo}>💧 Humidity: {weatherData.humidity}%</Text>
              <Text style={styles.weatherInfo}>🌬️ Wind: {weatherData.wind_speed} m/s</Text>
              <Text style={styles.weatherInfo}>☁️ {weatherData.description}</Text>
              <Text style={styles.weatherNote}>✅ Temperature & Rainfall auto-filled!</Text>
            </View>
          )}
        </View>

        <Text style={styles.label}>Soil Type</Text>
        <View style={styles.optionRow}>
          {SOILS.map(soil => (
            <TouchableOpacity
              key={soil}
              style={[styles.option, soilType === soil && styles.optionSelected]}
              onPress={() => setSoilType(soil)}
            >
              <Text style={[styles.optionText, soilType === soil && styles.optionTextSelected]}>
                {soil}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Rainfall (mm)</Text>
        <TextInput style={styles.input} placeholder="e.g. 800"
          keyboardType="numeric" value={rainfall} onChangeText={setRainfall} />

        <Text style={styles.label}>Temperature (°C)</Text>
        <TextInput style={styles.input} placeholder="e.g. 25"
          keyboardType="numeric" value={temperature} onChangeText={setTemperature} />

        <Text style={styles.label}>Fertilizer Used (kg)</Text>
        <TextInput style={styles.input} placeholder="e.g. 150"
          keyboardType="numeric" value={fertilizer} onChangeText={setFertilizer} />

        <Text style={styles.label}>Pesticide Used (kg)</Text>
        <TextInput style={styles.input} placeholder="e.g. 5"
          keyboardType="numeric" value={pesticide} onChangeText={setPesticide} />

        <Text style={styles.label}>Farm Area (hectares)</Text>
        <TextInput style={styles.input} placeholder="e.g. 10"
          keyboardType="numeric" value={area} onChangeText={setArea} />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePredict}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '🔄 Predicting...' : '🌾 Predict Yield'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline} onPress={() => setScreen('home')}>
          <Text style={styles.buttonOutlineText}>← Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // RESULT SCREEN
  if (screen === 'result' && result) {
    const getYieldColor = (y) => {
      if (y < 2) return '#e63946';
      if (y < 5) return '#f4a261';
      return '#2d6a4f';
    };

    const suggestions = getSuggestions(
      cropType, soilType,
      parseFloat(rainfall),
      parseFloat(temperature),
      parseFloat(fertilizer),
      parseFloat(area),
      result.predicted_yield_tons
    );

    return (
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.heading}>📊 Prediction Result</Text>

        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Predicted Yield</Text>
          <Text style={[styles.resultValue, { color: getYieldColor(result.predicted_yield_tons) }]}>
            {result.predicted_yield_tons} tons
          </Text>
          <Text style={styles.resultSub}>per farm area</Text>
        </View>

        <View style={styles.adviceCard}>
          <Text style={styles.adviceTitle}>💡 AI Advice</Text>
          <Text style={styles.adviceText}>{result.advice}</Text>
        </View>

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>🎯 Smart Suggestions For You</Text>
          {suggestions.map((s, index) => (
            <View key={index} style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionIcon}>{s.icon}</Text>
                <Text style={styles.suggestionCategory}>{s.category}</Text>
              </View>
              <Text style={styles.suggestionTip}>{s.tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>📋 Summary</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Crop</Text>
            <Text style={styles.detailValue}>{result.crop_type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Area</Text>
            <Text style={styles.detailValue}>{result.area_hectares} hectares</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Yield</Text>
            <Text style={styles.detailValue}>{result.predicted_yield_tons} tons</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => setScreen('input')}>
          <Text style={styles.buttonText}>🔄 Predict Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOutline} onPress={() => setScreen('home')}>
          <Text style={styles.buttonOutlineText}>🏠 Go Home</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  // ADMIN SCREEN
  if (screen === 'admin') {
    return <AdminDashboard />;
  }
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7f4', alignItems: 'center', justifyContent: 'center', padding: 20 },
  scrollContainer: { flex: 1, backgroundColor: '#f0f7f4', padding: 20 },
  emoji: { fontSize: 80, marginBottom: 10 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#2d6a4f', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#52b788', textAlign: 'center', marginBottom: 30 },
  infoBox: { backgroundColor: '#fff', borderRadius: 15, padding: 20, width: '100%', marginBottom: 30, elevation: 5 },
  infoText: { fontSize: 16, color: '#333', marginBottom: 10 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#2d6a4f', marginBottom: 20, textAlign: 'center', marginTop: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 15 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#2d6a4f', marginBottom: 5 },
  optionSelected: { backgroundColor: '#2d6a4f' },
  optionText: { color: '#2d6a4f', fontSize: 13 },
  optionTextSelected: { color: '#fff' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#2d6a4f', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 20, marginBottom: 15 },
  buttonDisabled: { backgroundColor: '#aaa' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  buttonOutline: { borderWidth: 2, borderColor: '#2d6a4f', padding: 18, borderRadius: 30, alignItems: 'center', marginBottom: 40 },
  buttonOutlineText: { color: '#2d6a4f', fontSize: 18, fontWeight: 'bold' },
  resultCard: { backgroundColor: '#fff', borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 20, elevation: 5 },
  resultLabel: { fontSize: 16, color: '#666', marginBottom: 10 },
  resultValue: { fontSize: 52, fontWeight: 'bold', marginBottom: 5 },
  resultSub: { fontSize: 14, color: '#999' },
  adviceCard: { backgroundColor: '#d8f3dc', borderRadius: 15, padding: 20, marginBottom: 20 },
  adviceTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d6a4f', marginBottom: 10 },
  adviceText: { fontSize: 15, color: '#333', lineHeight: 22 },
  detailCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 25, elevation: 3 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d6a4f', marginBottom: 15 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  detailLabel: { fontSize: 15, color: '#666' },
  detailValue: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  footer: { color: '#aaa', fontSize: 12, marginTop: 20 },
  suggestionsContainer: { marginBottom: 20 },
  suggestionsTitle: { fontSize: 20, fontWeight: 'bold', color: '#2d6a4f', marginBottom: 15, textAlign: 'center' },
  suggestionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#2d6a4f', elevation: 2 },
  suggestionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  suggestionIcon: { fontSize: 20, marginRight: 8 },
  suggestionCategory: { fontSize: 14, fontWeight: 'bold', color: '#2d6a4f', textTransform: 'uppercase' },
  suggestionTip: { fontSize: 14, color: '#444', lineHeight: 22 },

  // ADD THESE BELOW 👇
  weatherBox: { backgroundColor: '#e8f4f8', borderRadius: 15, padding: 15, marginBottom: 15, marginTop: 10 },
  weatherTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d6a4f', marginBottom: 10 },
  weatherRow: { flexDirection: 'row', gap: 10 },
  weatherInput: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#ddd' },
  weatherButton: { backgroundColor: '#2d6a4f', borderRadius: 10, padding: 10, justifyContent: 'center' },
  weatherButtonText: { color: '#fff', fontWeight: 'bold' },
  weatherResult: { marginTop: 10, backgroundColor: '#fff', borderRadius: 10, padding: 10 },
  weatherInfo: { fontSize: 14, color: '#333', marginBottom: 5 },
  weatherNote: { fontSize: 12, color: '#2d6a4f', fontWeight: 'bold', marginTop: 5 },

});  // ← closing bracket stays here
