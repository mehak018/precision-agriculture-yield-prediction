import React from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity
} from 'react-native';

export default function HomeScreen({ navigation }) {
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Input')}
      >
        <Text style={styles.buttonText}>Start Prediction →</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>
        Made by Mehak | Precision Agriculture AI
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7f4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: { fontSize: 80, marginBottom: 10 },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#52b788',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoText: { fontSize: 16, color: '#333', marginBottom: 10 },
  button: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { color: '#aaa', fontSize: 12, position: 'absolute', bottom: 20 },
});