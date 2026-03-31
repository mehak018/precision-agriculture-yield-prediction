import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert
} from 'react-native';

const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton'];
const SOILS = ['Sandy', 'Clay', 'Loamy', 'Silt', 'Peaty'];

export default function InputScreen({ navigation }) {
  const [cropType, setCropType]       = useState('Wheat');
  const [soilType, setSoilType]       = useState('Loamy');
  const [rainfall, setRainfall]       = useState('');
  const [temperature, setTemperature] = useState('');
  const [fertilizer, setFertilizer]   = useState('');
  const [pesticide, setPesticide]     = useState('');
  const [area, setArea]               = useState('');
  const [loading, setLoading]         = useState(false);

  const handlePredict = async () => {
    if (!rainfall || !temperature || !fertilizer || !pesticide || !area) {
      Alert.alert('Missing Info', 'Please fill all fields!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_type:     cropType,
          soil_type:     soilType,
          rainfall_mm:   parseFloat(rainfall),
          temperature_c: parseFloat(temperature),
          fertilizer_kg: parseFloat(fertilizer),
          pesticide_kg:  parseFloat(pesticide),
          area_hectares: parseFloat(area),
        }),
      });
      const data = await response.json();
      if (data.success) {
        navigation.navigate('Result', { result: data });
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Make sure Flask is running!');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
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

      <Text style={styles.label}>Crop Type</Text>
      <View style={styles.optionRow}>
        {CROPS.map(crop => (
          <TouchableOpacity
            key={crop}
            style={[styles.option, cropType === crop && styles.optionSelected]}
            onPress={() => setCropType(crop)}
          >
            <Text style={[styles.optionText, cropType === crop && styles.optionTextSelected]}>
              {crop}
            </Text>
          </TouchableOpacity>
        ))}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7f4', padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#2d6a4f', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 15 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#2d6a4f', marginBottom: 5 },
  optionSelected: { backgroundColor: '#2d6a4f' },
  optionText: { color: '#2d6a4f', fontSize: 13 },
  optionTextSelected: { color: '#fff' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#2d6a4f', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 30, marginBottom: 40 },
  buttonDisabled: { backgroundColor: '#aaa' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});