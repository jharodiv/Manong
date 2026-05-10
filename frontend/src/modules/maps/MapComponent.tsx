import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const MapComponent = ({ initialRegion }: any) => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation={true}
      showsMyLocationButton={false}
      showsCompass={false}
    />
  );
};

const styles = StyleSheet.create({
  map: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }
});
