import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions, PanResponder, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../../theme';
import { MapComponent } from './MapComponent';
import { FareCalculator } from './FareCalculator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_15_HEIGHT = SCREEN_HEIGHT * 0.15;
const SHEET_70_HEIGHT = SCREEN_HEIGHT * 0.7;
const SHEET_100_HEIGHT = SCREEN_HEIGHT;

const INITIAL_REGION = {
  latitude: 14.6516,
  longitude: 121.0308,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const DiscoveryPill = ({ label, icon, isPrimary = false, active = false, onPress }: any) => (
  <TouchableOpacity 
    style={[
      styles.pill, 
      isPrimary ? styles.primaryPill : (active ? styles.activePill : styles.secondaryPill)
    ]}
    activeOpacity={0.8}
    onPress={onPress}
  >
    {icon && (
      <View style={styles.pillIcon}>
        {isPrimary ? (
          <Ionicons name="globe-outline" size={16} color="#fff" />
        ) : (
          React.cloneElement(icon as any, { color: active ? theme.colors.primary : theme.colors.text })
        )}
      </View>
    )}
    <Text style={[
      styles.pillText, 
      isPrimary && styles.primaryPillText,
      active && styles.activePillText
    ]}>{label}</Text>
    {isPrimary && <Ionicons name="chevron-up" size={12} color="#fff" style={{ marginLeft: 4 }} />}
  </TouchableOpacity>
);

export const MapsScreen = () => {
  const [currentState, setCurrentState] = useState('peek');
  const [activeCategory, setActiveCategory] = useState('jeep');
  const sheetHeight = useRef(new Animated.Value(SHEET_15_HEIGHT)).current;
  const lastHeight = useRef(SHEET_15_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
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

  const headerPaddingTop = sheetHeight.interpolate({
    inputRange: [SHEET_70_HEIGHT, SHEET_100_HEIGHT],
    outputRange: [12, 4],
    extrapolate: 'clamp'
  });

  const handleMarginBottom = sheetHeight.interpolate({
    inputRange: [SHEET_70_HEIGHT, SHEET_100_HEIGHT],
    outputRange: [20, 0],
    extrapolate: 'clamp'
  });

  const discoveryBarBottom = sheetHeight.interpolate({
    inputRange: [SHEET_15_HEIGHT, SHEET_100_HEIGHT],
    outputRange: [SHEET_15_HEIGHT + 8, SHEET_100_HEIGHT - 60],
    extrapolate: 'clamp'
  });

  const discoveryBarOpacity = sheetHeight.interpolate({
    inputRange: [SHEET_70_HEIGHT, SHEET_100_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <MapComponent 
        initialRegion={INITIAL_REGION}
      />

      <Animated.View 
        style={[
          styles.floatingDiscoveryBar, 
          { bottom: discoveryBarBottom, opacity: discoveryBarOpacity }
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillScrollContent}>
          <DiscoveryPill 
            label="jeep" 
            icon={<MaterialCommunityIcons name="bus-side" size={14} />} 
            active={activeCategory === 'jeep'}
            onPress={() => { setActiveCategory('jeep'); snapTo('full'); }}
          />
          <DiscoveryPill 
            label="trike" 
            icon={<MaterialCommunityIcons name="rickshaw" size={14} />} 
            active={activeCategory === 'trike'}
            onPress={() => { setActiveCategory('trike'); snapTo('full'); }}
          />
          <DiscoveryPill 
            label="bus" 
            icon={<Ionicons name="bus-outline" size={14} />} 
            active={activeCategory === 'bus'}
            onPress={() => { setActiveCategory('bus'); snapTo('full'); }}
          />
          <DiscoveryPill 
            label="gas" 
            icon={<FontAwesome5 name="gas-pump" size={12} />} 
            active={activeCategory === 'gas'}
            onPress={() => { setActiveCategory('gas'); snapTo('full'); }}
          />
          <DiscoveryPill 
            label="banks" 
            icon={<Ionicons name="cash-outline" size={14} />} 
            active={activeCategory === 'banks'}
            onPress={() => setActiveCategory('banks')}
          />
        </ScrollView>
      </Animated.View>

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
        <View style={styles.gestureHeader}>
          <Animated.View 
            {...panResponder.panHandlers} 
            style={[styles.handleContainer, { opacity: handleOpacity, marginBottom: handleMarginBottom }]}
          >
            <View style={styles.handle} />
          </Animated.View>
          <View style={styles.sheetHeader}>
            <View style={styles.headerRow}>
              <Text style={styles.sheetTitle}>EXPLORE HUB</Text>
            </View>
            <Text style={styles.sheetSubtitle}>Real-time transit discovery</Text>
          </View>

          <TouchableOpacity 
            onPress={() => snapTo('peek')} 
            style={[styles.absoluteCloseBtn, { opacity: currentState === 'full' ? 1 : 0 }]}
            disabled={currentState !== 'full'}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <View style={styles.closeBtnInner}>
              <Ionicons name="chevron-down" size={20} color={theme.colors.text} />
            </View>
          </TouchableOpacity>
        </View>

      <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false} scrollEnabled={currentState === 'full'} contentContainerStyle={{ paddingBottom: 100 }}>
          <FareCalculator initialType={activeCategory} />

          <Text style={styles.sectionTitle}>POPULAR DESTINATIONS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScrollContent}>
            {[
              { id: 'sm-north', label: 'SM North EDSA', dist: 1.2, type: 'jeep', icon: 'cart-outline' },
              { id: 'trinoma', label: 'TriNoma Mall', dist: 1.5, type: 'jeep', icon: 'bag-handle-outline' },
              { id: 'up-diliman', label: 'UP Diliman', dist: 5.2, type: 'jeep', icon: 'school-outline' },
              { id: 'qc-circle', label: 'QC Circle', dist: 3.4, type: 'trike', icon: 'leaf-outline' },
            ].map((spot) => (
              <TouchableOpacity 
                key={spot.id} 
                style={styles.popularCard}
                onPress={() => {
                  setActiveCategory(spot.type);
                  // Return to full expansion as per previous stable state
                  snapTo('full');
                }}
              >
                <View style={styles.popularIcon}>
                  <Ionicons name={spot.icon as any} size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.popularLabel}>{spot.label}</Text>
                <Text style={styles.popularDist}>{spot.dist} km</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>NEARBY TRANSIT</Text>
          <TouchableOpacity style={styles.nearbyItem} activeOpacity={0.7}>
            <View style={[styles.typeIcon, { backgroundColor: '#eff6ff' }]}><Ionicons name="bus" size={18} color="#2563eb" /></View>
            <View style={styles.nearbyInfo}><Text style={styles.nearbyName}>SM North EDSA Terminal</Text><Text style={styles.nearbyDetail}>Jeep • 2 mins away</Text></View>
            <Text style={styles.nearbyFare}>₱13.00</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nearbyItem} activeOpacity={0.7}>
            <View style={[styles.typeIcon, { backgroundColor: '#f0fdf4' }]}><MaterialCommunityIcons name="train" size={20} color="#16a34a" /></View>
            <View style={styles.nearbyInfo}><Text style={styles.nearbyName}>North Avenue Station</Text><Text style={styles.nearbyDetail}>MRT-3 • 5 mins away</Text></View>
            <Text style={styles.nearbyFare}>₱16.00</Text>
          </TouchableOpacity>

          <Animated.View style={{ opacity: sheetHeight.interpolate({ inputRange: [SHEET_15_HEIGHT, SHEET_70_HEIGHT], outputRange: [0, 1], extrapolate: 'clamp' }) }}>
            <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
            <View style={styles.actionsGrid}>
              {['HOME', 'WORK', 'SAVED'].map((label, idx) => (
                <View key={label} style={styles.actionCard}>
                  <View style={[styles.actionIcon, { backgroundColor: idx === 0 ? '#f0fdf4' : idx === 1 ? '#fff7ed' : '#f5f3ff' }]}>
                    <Ionicons name={idx === 0 ? "home-outline" : idx === 1 ? "briefcase-outline" : "heart-outline"} size={20} color={idx === 0 ? "#16a34a" : idx === 1 ? "#ea580c" : "#7c3aed"} />
                  </View>
                  <Text style={styles.actionLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  floatingDiscoveryBar: { position: 'absolute', left: 0, right: 0, zIndex: 30 },
  pillScrollContent: { paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', gap: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24, height: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  primaryPill: { backgroundColor: '#10b981', paddingRight: 10 },
  activePill: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: theme.colors.primary },
  activePillText: { color: theme.colors.primary },
  secondaryPill: { backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  pillIcon: { marginRight: 6 },
  pillText: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  primaryPillText: { color: '#fff' },
  curationHeader: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 16, marginTop: 8, letterSpacing: -0.5 },
  curationScrollContent: { paddingBottom: 24, gap: 16 },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: -12 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 24, zIndex: 20 },
  gestureHeader: { width: '100%', paddingHorizontal: 24, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  handleContainer: { width: '100%', alignItems: 'center' },
  handle: { width: 44, height: 5, backgroundColor: '#e2e8f0', borderRadius: 3 },
  sheetHeader: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  absoluteCloseBtn: {
    position: 'absolute',
    top: 36,
    right: 24,
    zIndex: 9999,
  },
  closeBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sheetTitle: { fontSize: 16, fontWeight: '900', color: theme.colors.text, letterSpacing: 1 },
  sheetSubtitle: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
  sheetContent: { flex: 1, paddingHorizontal: 24 },
  popularScrollContent: { gap: 12, paddingBottom: 8 },
  popularCard: { width: 130, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  popularIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  popularLabel: { fontSize: 13, fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  popularDist: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: theme.colors.textMuted, letterSpacing: 0.5, marginBottom: 16, marginTop: 16 },
  nearbyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: theme.borderRadius.lg, padding: 16, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 12 },
  typeIcon: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  nearbyInfo: { flex: 1 },
  nearbyName: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  nearbyDetail: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  nearbyFare: { fontSize: 16, fontWeight: '900', color: theme.colors.primary },
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 8 },
  actionCard: { alignItems: 'center', width: (SCREEN_WIDTH - 80) / 3 },
  actionIcon: { width: 54, height: 54, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)' },
  actionLabel: { fontSize: 10, fontWeight: '700', color: theme.colors.textMuted, letterSpacing: 0.5 },
});
