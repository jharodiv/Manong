import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const MapComponent = ({ initialRegion }: any) => {
  return (
    <View style={[styles.map, styles.webPlaceholder]}>
      <Ionicons name="map" size={64} color="#cbd5e1" />
      <Text style={styles.placeholderText}>Interactive Map is active on Mobile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  map: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  webPlaceholder: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 16,
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  }
});
