import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Dimensions, TextInput, PanResponder, ScrollView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { theme } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_15_HEIGHT = SCREEN_HEIGHT * 0.15;
const SHEET_70_HEIGHT = SCREEN_HEIGHT * 0.7;
const SHEET_100_HEIGHT = SCREEN_HEIGHT;

const PulsingPin = ({ top, left, delay = 0 }: any) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 2.5],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  return (
    <View style={[styles.pinContainer, { top, left }]}>
      <Animated.View 
        style={[
          styles.pulse, 
          { transform: [{ scale }], opacity }
        ]} 
      />
      <View style={styles.pinInner}>
        <View style={styles.pinDot} />
      </View>
    </View>
  );
};

export const MapsScreen = () => {
  const [currentState, setCurrentState] = useState('peek'); // peek, mid, full
  const sheetHeight = useRef(new Animated.Value(SHEET_15_HEIGHT)).current;
  const lastHeight = useRef(SHEET_15_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 2,
      onPanResponderMove: (_, gestureState) => {
        let newHeight = lastHeight.current - gestureState.dy;
        
        if (newHeight < SHEET_15_HEIGHT) {
          newHeight = SHEET_15_HEIGHT + (newHeight - SHEET_15_HEIGHT) * 0.2;
        } else if (newHeight > SHEET_100_HEIGHT) {
          newHeight = SHEET_100_HEIGHT + (newHeight - SHEET_100_HEIGHT) * 0.2;
        }
        
        sheetHeight.setValue(newHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentH = (sheetHeight as any)._value;
        const velocity = gestureState.vy;

        if (velocity < -0.5) {
          if (currentH < SHEET_70_HEIGHT) snapTo('mid');
          else snapTo('full');
        } else if (velocity > 0.5) {
          if (currentH > SHEET_70_HEIGHT) snapTo('mid');
          else snapTo('peek');
        } else {
          if (currentH < (SHEET_15_HEIGHT + SHEET_70_HEIGHT) / 2) snapTo('peek');
          else if (currentH < (SHEET_70_HEIGHT + SHEET_100_HEIGHT) / 2) snapTo('mid');
          else snapTo('full');
        }
      },
    })
  ).current;

  const snapTo = (targetState: string) => {
    setCurrentState(targetState);
    let toValue = SHEET_15_HEIGHT;
    if (targetState === 'mid') toValue = SHEET_70_HEIGHT;
    if (targetState === 'full') toValue = SHEET_100_HEIGHT;

    lastHeight.current = toValue;
    
    Animated.spring(sheetHeight, {
      toValue,
      useNativeDriver: false,
      bounciness: 6,
      speed: 12,
    }).start();
  };

  // 🎯 Dynamic Structural Interpolations:
  
  // Arrow/Handle Authority
  const arrowOpacity = sheetHeight.interpolate({
    inputRange: [SCREEN_HEIGHT * 0.95, SCREEN_HEIGHT * 0.99],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const handleOpacity = sheetHeight.interpolate({
    inputRange: [SCREEN_HEIGHT * 0.95, SCREEN_HEIGHT * 0.98],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  // 🎯 Top Spacing Compaction (Remove height when 100%)
  const headerPaddingTop = sheetHeight.interpolate({
    inputRange: [SHEET_70_HEIGHT, SHEET_100_HEIGHT],
    outputRange: [12, 4], // Minimal spacing for full-screen edge
    extrapolate: 'clamp'
  });

  const handleMarginBottom = sheetHeight.interpolate({
    inputRange: [SHEET_70_HEIGHT, SHEET_100_HEIGHT],
    outputRange: [20, 0], // Systematic removal of spacer
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      {/* Map Backdrop */}
      <Image 
        source={{ uri: 'C:\\Users\\j1lou\\.gemini\\antigravity\\brain\\bd472bbe-6f3a-4a2f-b6c1-056ebb82fc84\\minimalist_city_map_manila_1777724595052.png' }}
        style={styles.map}
        resizeMode="cover"
      />

      {/* Interactive Pins */}
      <PulsingPin top={SCREEN_HEIGHT * 0.1} left={SCREEN_WIDTH * 0.4} />
      <PulsingPin top={SCREEN_HEIGHT * 0.2} left={SCREEN_WIDTH * 0.7} delay={500} />
      <PulsingPin top={SCREEN_HEIGHT * 0.15} left={SCREEN_WIDTH * 0.2} delay={1000} />

      {/* High-Performance Tri-State Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheet, 
          { 
            height: sheetHeight,
            borderTopLeftRadius: sheetHeight.interpolate({
              inputRange: [SHEET_70_HEIGHT, SHEET_100_HEIGHT],
              outputRange: [32, 0],
              extrapolate: 'clamp'
            }),
            borderTopRightRadius: sheetHeight.interpolate({
              inputRange: [SHEET_70_HEIGHT, SHEET_100_HEIGHT],
              outputRange: [32, 0],
              extrapolate: 'clamp'
            }),
          }
        ]} 
      >
        {/* Animated Gesture Header Area */}
        <Animated.View 
          {...panResponder.panHandlers} 
          style={[
            styles.gestureHeader, 
            { paddingTop: headerPaddingTop }
          ]}
        >
          {/* Intelligent Stealth Handle */}
          <Animated.View style={[
            styles.handleContainer, 
            { opacity: handleOpacity, marginBottom: handleMarginBottom }
          ]}>
            <View style={styles.handle} />
          </Animated.View>
          
          <View style={styles.sheetHeader}>
            <View style={styles.headerRow}>
              <Text style={styles.sheetTitle}>EXPLORE HUB</Text>
              
              {/* Dynamic Stealth Arrow */}
              <Animated.View style={{ opacity: arrowOpacity }}>
                <TouchableOpacity 
                  onPress={() => snapTo('mid')}
                  disabled={currentState !== 'full'}
                >
                  <Ionicons 
                    name="chevron-down" 
                    size={24} 
                    color={theme.colors.textMuted} 
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
            <Text style={styles.sheetSubtitle}>Nearby transit and active routes</Text>
          </View>
        </Animated.View>

        <ScrollView 
          style={styles.sheetContent} 
          showsVerticalScrollIndicator={false}
          scrollEnabled={currentState === 'full'}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Nearby Section */}
          <Text style={styles.sectionTitle}>NEARBY TRANSIT</Text>
          <TouchableOpacity style={styles.nearbyItem} activeOpacity={0.7}>
            <View style={[styles.typeIcon, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="bus" size={18} color="#2563eb" />
            </View>
            <View style={styles.nearbyInfo}>
              <Text style={styles.nearbyName}>SM North EDSA Terminal</Text>
              <Text style={styles.nearbyDetail}>Jeep • 2 mins away</Text>
            </View>
            <Text style={styles.nearbyFare}>₱13.00</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nearbyItem} activeOpacity={0.7}>
            <View style={[styles.typeIcon, { backgroundColor: '#f0fdf4' }]}>
              <MaterialCommunityIcons name="train" size={20} color="#16a34a" />
            </View>
            <View style={styles.nearbyInfo}>
              <Text style={styles.nearbyName}>North Avenue Station</Text>
              <Text style={styles.nearbyDetail}>MRT-3 • 5 mins away</Text>
            </View>
            <Text style={styles.nearbyFare}>₱16.00</Text>
          </TouchableOpacity>

          {/* Expanded Content Section */}
          <Animated.View style={{ 
            opacity: sheetHeight.interpolate({ 
              inputRange: [SHEET_15_HEIGHT, SHEET_70_HEIGHT], 
              outputRange: [0, 1],
              extrapolate: 'clamp'
            }) 
          }}>
            <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
            <View style={styles.actionsGrid}>
              <View style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: '#f0fdf4' }]}>
                  <Ionicons name="home-outline" size={20} color="#16a34a" />
                </View>
                <Text style={styles.actionLabel}>HOME</Text>
              </View>
              <View style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: '#fff7ed' }]}>
                  <Ionicons name="briefcase-outline" size={20} color="#ea580c" />
                </View>
                <Text style={styles.actionLabel}>WORK</Text>
              </View>
              <View style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: '#f5f3ff' }]}>
                  <Ionicons name="heart-outline" size={20} color="#7c3aed" />
                </View>
                <Text style={styles.actionLabel}>SAVED</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>RECENT DESTINATIONS</Text>
            <View style={styles.recentItem}>
              <Ionicons name="time-outline" size={18} color={theme.colors.textMuted} />
              <Text style={styles.recentText}>Trinoma Mall, Quezon City</Text>
            </View>
            <View style={styles.recentItem}>
              <Ionicons name="time-outline" size={18} color={theme.colors.textMuted} />
              <Text style={styles.recentText}>Manaoag Church, Pangasinan</Text>
            </View>

            <Text style={styles.sectionTitle}>SERVICE STATUS</Text>
            <View style={styles.serviceItem}>
              <View style={[styles.serviceBullet, { backgroundColor: '#2563eb' }]} />
              <Text style={styles.serviceText}>LRT-1 Roosevelt Extension (Open)</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={[styles.serviceBullet, { backgroundColor: '#10b981' }]} />
              <Text style={styles.serviceText}>BGC Bus West Route (Active)</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  pinContainer: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
  },
  pinInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  pinDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    alignSelf: 'center',
    marginTop: 2,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 24,
    zIndex: 20,
  },
  gestureHeader: {
    width: '100%',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  handle: {
    width: 44,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
  },
  sheetHeader: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.text,
    letterSpacing: 1,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 16,
    marginTop: 16,
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  typeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  nearbyDetail: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  nearbyFare: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  actionCard: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 80) / 3,
  },
  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  recentText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  serviceBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  serviceText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: '500',
  }
});
