import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const RouteMap = ({ route }: { route: any }) => {
  if (!route || !route.stops || route.stops.length === 0) return null;

  const stopsJson = JSON.stringify(route.stops);
  const routeColor = route.color || '#2563eb';

  // Enhanced map implementation using Cloudflare CDN and robust initialization
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Transit Map</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background: #e2e8f0; }
        #map { height: 100vh; width: 100vw; background: #e2e8f0; }
        .pin {
          background-color: ${routeColor};
          border: 2px solid #fff;
          border-radius: 50%;
          color: white;
          text-align: center;
          font-weight: 900;
          font-family: sans-serif;
          font-size: 11px;
          line-height: 22px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        window.addEventListener('load', function() {
          try {
            const stops = ${stopsJson};
            const map = L.map('map', { zoomControl: false, attributionControl: false });
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            const latlngs = stops.map(s => [s.lat, s.lng]);
            const polyline = L.polyline(latlngs, { color: '${routeColor}', weight: 5, opacity: 0.8 }).addTo(map);

            stops.forEach((stop, index) => {
              const icon = L.divIcon({
                className: 'pin',
                html: (index + 1).toString(),
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              });
              L.marker([stop.lat, stop.lng], { icon }).addTo(map);
            });

            if (latlngs.length > 0) {
              map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
            }
          } catch (e) {
            console.error('Map Load Error:', e);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.webMapContainer}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Loading Interactive Map...</Text>
      </View>
      <iframe
        title="Transit Exploration Map"
        width="100%"
        height="100%"
        frameBorder="0"
        srcDoc={mapHtml}
        style={styles.iframe}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webMapContainer: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  placeholderText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
});
