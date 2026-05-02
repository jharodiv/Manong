import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { Screen } from '../../components/Screen';
import { FuelRateCard } from '../../components/FuelRateCard';
import { TransportationRateCard } from '../../components/TransportationRateCard';

const FUEL_DATA = [
  { company: 'Petron', price: 63.20, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/Petron_Corporation_logo.svg/1200px-Petron_Corporation_logo.svg.png' },
  { company: 'Shell', price: 64.35, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png' },
  { company: 'Caltex', price: 63.85, logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Caltex_logo.svg/1200px-Caltex_logo.svg.png' },
  { company: 'Centrum', price: 62.95, logo: '' },
  { company: 'Phoenix', price: 62.75, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Phoenix_Petroleum_logo.svg/1200px-Phoenix_Petroleum_logo.svg.png' },
];

const TRANSPORT_DATA = [
  {
    title: 'Jeepney Fare',
    details: ['Base fare: ₱15.00', 'Additional per km: ₱2.00'],
    price: '₱15.00',
    icon: 'bus-side',
    color: theme.colors.iconJeep
  },
  {
    title: 'Tricycle Fare',
    details: ['Regular: ₱20.00', 'Special (Over 4 km): ₱40.00'],
    price: '₱20.00',
    icon: 'rickshaw',
    color: theme.colors.iconTrike
  },
  {
    title: 'Bus Fare',
    details: ['Ordinary: ₱2.50 per km', 'Aircon: ₱3.50 per km'],
    price: '₱2.50',
    icon: 'bus',
    color: theme.colors.iconBus
  },
  {
    title: 'UV Express',
    details: ['Manaoag → Dagupan', 'One way'],
    price: '₱60.00',
    icon: 'van-passenger',
    color: theme.colors.iconUV
  },
  {
    title: 'Taxi / Grab Estimate',
    details: ['Flag down: ₱45.00', '₱15.00 per km'],
    price: '₱45.00',
    icon: 'car',
    color: theme.colors.iconTaxi
  },
];

export const RatesScreen = () => {
  const [showLeftFade, setShowLeftFade] = React.useState(false);
  const [showRightFade, setShowRightFade] = React.useState(true);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    setShowLeftFade(contentOffset.x > 10);
    setShowRightFade(contentOffset.x < contentSize.width - layoutMeasurement.width - 10);
  };

  const renderRight = () => (
    <TouchableOpacity style={styles.notificationBtn}>
      <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
      <View style={styles.notificationBadge} />
    </TouchableOpacity>
  );

  return (
    <Screen title="Rates" rightComponent={renderRight()}>
      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          {/* Location Card */}
          <View style={styles.locationCard}>
            <View style={styles.locationIconContainer}>
              <Ionicons name="location" size={20} color="#2563eb" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Your Location</Text>
              <Text style={styles.locationValue}>Manaoag, Pangasinan</Text>
            </View>
            <TouchableOpacity style={styles.changeBtn}>
              <MaterialCommunityIcons name="target" size={16} color="#2563eb" />
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Fuel Prices Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fuel Prices Today</Text>
            <View style={styles.sectionHeaderRight}>
              <Text style={styles.updatedText}>Updated: 7:30 AM</Text>
              <Ionicons name="information-circle-outline" size={14} color={theme.colors.textMuted} />
            </View>
          </View>
        </View>

        {/* Bleeding Horizontal List */}
        <View style={styles.fuelScrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fuelScrollContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {FUEL_DATA.map((item, index) => (
              <FuelRateCard
                key={index}
                company={item.company}
                price={item.price}
                logoUrl={item.logo}
              />
            ))}
          </ScrollView>
          {showLeftFade && (
            <LinearGradient 
              colors={[theme.colors.background, 'transparent']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }} 
              style={[styles.fadeOverlay, styles.fadeLeft]} 
              pointerEvents="none" 
            />
          )}
          {showRightFade && (
            <LinearGradient 
              colors={['transparent', theme.colors.background]} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }} 
              style={[styles.fadeOverlay, styles.fadeRight]} 
              pointerEvents="none" 
            />
          )}
        </View>

        <View style={styles.sectionContainer}>
          {/* Transportation Rates Section Header */}
          <View style={[styles.sectionHeader, { marginTop: theme.spacing.sm }]}>
            <View>
              <Text style={styles.sectionTitle}>Nearby Transportation Rates</Text>
              <Text style={styles.sectionSubtitle}>Fares around your location</Text>
            </View>
          </View>

          <View style={styles.transportList}>
            {TRANSPORT_DATA.map((item, index) => (
              <TransportationRateCard
                key={index}
                title={item.title}
                details={item.details}
                price={item.price}
                iconName={item.icon}
                iconColor={item.color}
              />
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <View style={{ marginTop: 1 }}>
                <Ionicons name="information-circle-outline" size={14} color="#2563eb" />
              </View>
              <Text style={styles.footerText}>Fares may change without prior notice.</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.sourceText}>Source: Local Operators</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  contentScroll: {
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  notificationBtn: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
    borderWidth: 1.5,
    borderColor: theme.colors.background,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  updatedText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginRight: 4,
  },
  fuelScrollContainer: {
    position: 'relative',
  },
  fuelScrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 4,
  },
  fadeOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 30,
    zIndex: 1,
  },
  fadeLeft: {
    left: 0,
  },
  fadeRight: {
    right: 0,
  },
  transportList: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginLeft: 4,
    includeFontPadding: false,
  },
  sourceText: {
    fontSize: 11,
    color: '#2563eb',
    textDecorationLine: 'underline',
  }
});
