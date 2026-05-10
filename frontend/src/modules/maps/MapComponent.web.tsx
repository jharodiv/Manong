import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const MapComponent = () => {
  return (
    <View style={styles.webMapContainer}>
      <View style={styles.iframeWrapper}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15440.6!2d121.0308!3d14.6516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sph!4v1714650000000!5m2!1sen!2sph"
          style={styles.iframe}
          allowFullScreen={false}
          loading="lazy"
        />
        {/* 🛡️ Stealth UI Mask: Blocks the "Open in Maps" box while keeping map interactive */}
        <View style={styles.uiMask} pointerEvents="none" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webMapContainer: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute', backgroundColor: '#f1f5f9' },
  iframeWrapper: { width: '100%', height: '100%', overflow: 'hidden' },
  iframe: { 
    width: '100%', 
    height: '100%', 
    border: 'none',
    marginTop: -40, // 🪓 Systematic "Crop" of the Google Maps top UI bar
    height: 'calc(100% + 40px)'
  },
  uiMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Systematic coverage of the "Open in Maps" zone
    backgroundColor: 'transparent',
    zIndex: 5
  }
});
