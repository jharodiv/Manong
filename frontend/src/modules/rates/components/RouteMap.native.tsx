import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

export const RouteMap = ({ route }: { route: any }) => {
  if (!route) return null;

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: route.stops[0].lat,
        longitude: route.stops[0].lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      <Polyline
        coordinates={route.stops.map((s: any) => ({ latitude: s.lat, longitude: s.lng }))}
        strokeColor={route.color}
        strokeWidth={4}
      />
      {route.stops.map((stop: any, index: number) => (
        <Marker
          key={index}
          coordinate={{ latitude: stop.lat, longitude: stop.lng }}
          title={stop.name}
        >
          <View style={[styles.mapMarker, { backgroundColor: route.color }]}>
            <Text style={styles.markerText}>{index + 1}</Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  markerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
});
