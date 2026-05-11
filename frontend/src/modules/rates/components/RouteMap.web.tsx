import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const RouteMap = ({ route }: { route: any }) => {
  if (!route || !route.stops || route.stops.length === 0) return null;

  const stopsJson = JSON.stringify(route.stops);
  const routeColor = route.color || '#2563eb';

  // "Final Boss" Map Implementation: High-Precision Leaflet with Numbered Nodes & Sequence Lines
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body, html { margin: 0; padding: 0; height: 100%; background: #f1f5f9; font-family: -apple-system, sans-serif; }
        #map { height: 100%; width: 100%; background: #cbd5e1; }
        .pin-node {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .pin-inner {
          width: 24px !important;
          height: 24px !important;
          background: ${routeColor} !important;
          border: 2px solid #ffffff !important;
          border-radius: 50% !important;
          color: white !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-weight: 900 !important;
          font-size: 12px !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
          box-sizing: border-box !important;
          padding: 0 !important;
          margin: 0 !important;
          line-height: 1 !important;
        }
      </style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
    </head>
    <body>
      <div id="map"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
      <script>
        function initMap() {
          try {
            const stops = ${stopsJson};
            if (!stops || stops.length === 0) return;

            const map = L.map('map', { 
              zoomControl: false, 
              attributionControl: false,
              dragging: true,
              scrollWheelZoom: true
            });
            
            // Standard OSM tiles (Most reliable for local Chrome dev)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            const latlngs = stops.map(s => [parseFloat(s.lat), parseFloat(s.lng)]);
            
            // 1. DRAW HIGH-CONTRAST ROUTE LINE
            const polyline = L.polyline(latlngs, {
              color: '${routeColor}',
              weight: 6,
              opacity: 0.8,
              lineJoin: 'round',
              lineCap: 'round'
            }).addTo(map);

            // 2. PLOT NUMBERED PINS (LONGITUDE / LATITUDE)
            stops.forEach((stop, index) => {
              const icon = L.divIcon({
                className: 'pin-node',
                html: '<div class="pin-inner">' + (index + 1) + '</div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              });
              
              L.marker([parseFloat(stop.lat), parseFloat(stop.lng)], { icon: icon })
               .addTo(map)
               .bindPopup('<b>' + stop.name + '</b><br>' + stop.time);
            });

            // 3. AUTO-FOCUS viewport on the entire sequence
            if (latlngs.length > 0) {
              map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
            }
          } catch (e) {
            document.body.innerHTML = '<div style="padding:40px; text-align:center; color:#64748b;"><h3>Map Error</h3><p>' + e.message + '</p></div>';
          }
        }
        
        // Wait for Leaflet to be ready
        window.addEventListener('load', function() {
          if (typeof L !== 'undefined') {
            initMap();
          } else {
            let retry = 0;
            const timer = setInterval(() => {
              if (typeof L !== 'undefined') {
                clearInterval(timer);
                initMap();
              } else if (retry > 10) {
                clearInterval(timer);
              }
              retry++;
            }, 500);
          }
        });
      </script>
    </body>
    </html>
  `;

  // Use Data URI with UTF-8 encoding for reliable Chrome injection
  const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(mapHtml)}`;

  return (
    <View style={styles.webMapContainer}>
      <View style={styles.statusLayer}>
        <Text style={styles.statusText}>Plotted {route.stops.length} Station Nodes...</Text>
      </View>
      <iframe
        title="Interactive Transit Sequence"
        src={dataUri}
        style={styles.iframe}
        frameBorder="0"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webMapContainer: {
    flex: 1,
    backgroundColor: '#cbd5e1',
    position: 'relative',
    minHeight: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statusLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  statusText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iframe: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    border: 'none',
  },
});
