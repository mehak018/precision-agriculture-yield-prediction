import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ResultScreen({ route, navigation }) {
  const { result } = route.params;

  const getYieldColor = (yield_tons) => {
    if (yield_tons < 2) return '#e63946';
    if (yield_tons < 5) return '#f4a261';
    return '#2d6a4f';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>📊 Prediction Result</Text>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Predicted Yield</Text>
        <Text style={[styles.resultValue, { color: getYieldColor(result.predicted_yield_tons) }]}>
          {result.predicted_yield_tons} tons
        </Text>
        <Text style={styles.resultSub}>per farm area</Text>
      </View>

      <View style={styles.adviceCard}>
        <Text style={styles.adviceTitle}>💡 Farming Advice</Text>
        <Text style={styles.adviceText}>{result.advice}</Text>
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

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Input')}>
        <Text style={styles.buttonText}>🔄 Predict Again</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonOutlineText}>🏠 Go Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7f4', padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#2d6a4f', marginBottom: 20, textAlign: 'center' },
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
  button: { backgroundColor: '#2d6a4f', padding: 18, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  buttonOutline: { borderWidth: 2, borderColor: '#2d6a4f', padding: 18, borderRadius: 30, alignItems: 'center', marginBottom: 40 },
  buttonOutlineText: { color: '#2d6a4f', fontSize: 18, fontWeight: 'bold' },
});