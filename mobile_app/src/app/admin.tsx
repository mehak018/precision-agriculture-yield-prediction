import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput
} from 'react-native';

const DISTRICTS = [
  'Solapur', 'Pune', 'Nashik', 'Aurangabad',
  'Kolhapur', 'Nagpur', 'Amravati', 'Satara'
];

const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton'];

export default function AdminDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState('Solapur');
  const [selectedCrop, setSelectedCrop]         = useState('Wheat');
  const [totalArea, setTotalArea]               = useState('1000');
  const [loading, setLoading]                   = useState(false);
  const [prediction, setPrediction]             = useState(null);
  const [weatherData, setWeatherData]           = useState<any>(null);

  // Fetch weather on load
  useEffect(() => {
    fetchDistrictWeather(selectedDistrict);
  }, [selectedDistrict]);

  const fetchDistrictWeather = async (district: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/weather?city=${district}`);
      const data = await response.json();
      if (data.success) setWeatherData(data);
    } catch (error) {
      console.log('Weather fetch error:', error);
    }
  };

  const handleDistrictPredict = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_type:     selectedCrop,
          soil_type:     'Loamy',
          rainfall_mm:   weatherData ? weatherData.rainfall * 365 : 800,
          temperature_c: weatherData ? weatherData.temperature : 25,
          fertilizer_kg: 150,
          pesticide_kg:  5,
          area_hectares: parseFloat(totalArea),
        }),
      });
      const data = await response.json();
      if (data.success) setPrediction(data);
    } catch (error) {
      alert('Cannot connect to API!');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏛️ Admin Dashboard</Text>
        <Text style={styles.headerSub}>Agricultural Department — Maharashtra</Text>
      </View>

      {/* District Selection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Select District</Text>
        <View style={styles.optionRow}>
          {DISTRICTS.map(district => (
            <TouchableOpacity
              key={district}
              style={[styles.option, selectedDistrict === district && styles.optionSelected]}
              onPress={() => setSelectedDistrict(district)}
            >
              <Text style={[styles.optionText, selectedDistrict === district && styles.optionTextSelected]}>
                {district}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Weather Card */}
      {weatherData && (
        <View style={styles.weatherCard}>
          <Text style={styles.cardTitle}>🌤️ {selectedDistrict} Weather</Text>
          <View style={styles.weatherGrid}>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherValue}>{weatherData.temperature}°C</Text>
              <Text style={styles.weatherLabel}>Temperature</Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherValue}>{weatherData.humidity}%</Text>
              <Text style={styles.weatherLabel}>Humidity</Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherValue}>{weatherData.wind_speed}</Text>
              <Text style={styles.weatherLabel}>Wind m/s</Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherValue}>{weatherData.description}</Text>
              <Text style={styles.weatherLabel}>Condition</Text>
            </View>
          </View>
        </View>
      )}

      {/* Crop Selection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌾 Select Crop</Text>
        <View style={styles.optionRow}>
          {CROPS.map(crop => (
            <TouchableOpacity
              key={crop}
              style={[styles.option, selectedCrop === crop && styles.optionSelected]}
              onPress={() => setSelectedCrop(crop)}
            >
              <Text style={[styles.optionText, selectedCrop === crop && styles.optionTextSelected]}>
                {crop}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Total Area Input */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📐 Total Cultivated Area (hectares)</Text>
        <TextInput
          style={styles.input}
          value={totalArea}
          onChangeText={setTotalArea}
          keyboardType="numeric"
          placeholder="Enter total area"
        />
      </View>

      {/* Predict Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleDistrictPredict}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '🔄 Calculating...' : '📊 Generate District Report'}
        </Text>
      </TouchableOpacity>

      {/* Results */}
      {prediction && (
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>📋 District Yield Report</Text>

          <View style={styles.resultGrid}>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{prediction.predicted_yield_tons}</Text>
              <Text style={styles.resultLabel}>Yield per hectare (tons)</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>
                {(prediction.predicted_yield_tons * parseFloat(totalArea)).toFixed(0)}
              </Text>
              <Text style={styles.resultLabel}>Total District Yield (tons)</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>
                {((prediction.predicted_yield_tons * parseFloat(totalArea)) / 10).toFixed(0)}
              </Text>
              <Text style={styles.resultLabel}>Storage Required (tons)</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>
                ₹{((prediction.predicted_yield_tons * parseFloat(totalArea)) * 2000).toLocaleString()}
              </Text>
              <Text style={styles.resultLabel}>Est. Market Value</Text>
            </View>
          </View>

          {/* Procurement Advice */}
          <View style={styles.adviceCard}>
            <Text style={styles.adviceTitle}>🏛️ Procurement Recommendations</Text>
            <Text style={styles.adviceText}>
              • Prepare {((prediction.predicted_yield_tons * parseFloat(totalArea)) / 10).toFixed(0)} tons storage capacity
            </Text>
            <Text style={styles.adviceText}>
              • Allocate budget for {selectedCrop} procurement in {selectedDistrict}
            </Text>
            <Text style={styles.adviceText}>
              • Expected harvest: 30-45 days from now
            </Text>
            <Text style={styles.adviceText}>
              • Notify {Math.floor(parseFloat(totalArea) / 5)} farmers in district
            </Text>
          </View>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1a3c34', padding: 25, paddingTop: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 14, color: '#52b788', marginTop: 5 },
  card: { backgroundColor: '#fff', margin: 15, marginBottom: 0, borderRadius: 15, padding: 20, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a3c34', marginBottom: 15 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#2d6a4f', marginBottom: 5 },
  optionSelected: { backgroundColor: '#2d6a4f' },
  optionText: { color: '#2d6a4f', fontSize: 13 },
  optionTextSelected: { color: '#fff' },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#1a3c34', margin: 15, padding: 18, borderRadius: 30, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#aaa' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  weatherCard: { backgroundColor: '#e8f4f8', margin: 15, marginBottom: 0, borderRadius: 15, padding: 20 },
  weatherGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  weatherItem: { backgroundColor: '#fff', borderRadius: 10, padding: 12, alignItems: 'center', minWidth: '45%', flex: 1 },
  weatherValue: { fontSize: 18, fontWeight: 'bold', color: '#1a3c34' },
  weatherLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  resultSection: { margin: 15 },
  resultTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a3c34', marginBottom: 15, textAlign: 'center' },
  resultGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 },
  resultItem: { backgroundColor: '#fff', borderRadius: 12, padding: 15, alignItems: 'center', minWidth: '45%', flex: 1, elevation: 2 },
  resultValue: { fontSize: 20, fontWeight: 'bold', color: '#2d6a4f' },
  resultLabel: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'center' },
  adviceCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 3 },
  adviceTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a3c34', marginBottom: 12 },
  adviceText: { fontSize: 14, color: '#444', marginBottom: 8, lineHeight: 22 },
});