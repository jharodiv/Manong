import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, Dimensions, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { Screen } from '../../components/Screen';
import { FuelRateCard } from '../../components/FuelRateCard';
import { TransportationRateCard } from '../../components/TransportationRateCard';
import { RouteMap } from './components/RouteMap';

const FUEL_DATA = [
  { company: 'Petron', price: 63.20, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/Petron_Corporation_logo.svg/1200px-Petron_Corporation_logo.svg.png' },
  { company: 'Shell', price: 64.35, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png' },
  { company: 'Caltex', price: 63.85, logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Caltex_logo.svg/1200px-Caltex_logo.svg.png' },
  { company: 'Centrum', price: 62.95, logo: '' },
  { company: 'Phoenix', price: 62.75, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Phoenix_Petroleum_logo.svg/1200px-Phoenix_Petroleum_logo.svg.png' },
];

const ROUTE_DATA = [
  {
    id: '1',
    title: 'Manaoag → Dagupan',
    type: 'uv',
    terminal: 'Manaoag Central Terminal',
    terminalAddress: 'Soriano St, Manaoag, Pangasinan',
    stops: [
      { name: 'Manaoag Terminal', info: 'Origin', time: '0 min' },
      { name: 'Pao', info: '2.5 km', time: '8 min' },
      { name: 'Bued', info: '4.2 km', time: '15 min' },
      { name: 'Calasiao', info: '8.1 km', time: '25 min' },
      { name: 'Dagupan City', info: 'Destination', time: '35 min' },
    ],
    price: '₱60.00',
    icon: 'van-passenger',
    color: theme.colors.iconUV
  },
  {
    id: '2',
    title: 'Manaoag → Urdaneta',
    type: 'jeep',
    terminal: 'Public Market Terminal',
    terminalAddress: 'Poblacion, Manaoag',
    stops: [
      { name: 'Manaoag Market', info: 'Origin', time: '0 min' },
      { name: 'Sapang', info: '1.8 km', time: '5 min' },
      { name: 'Laoac', info: '5.2 km', time: '12 min' },
      { name: 'Nancayasan', info: '8.4 km', time: '20 min' },
      { name: 'Urdaneta City', info: 'Destination', time: '28 min' },
    ],
    price: '₱35.00',
    icon: 'bus-side',
    color: theme.colors.iconJeep
  },
  {
    id: '3',
    title: 'Binalonan → Manaoag',
    type: 'jeep',
    terminal: 'Binalonan Crossing',
    terminalAddress: 'McArthur Highway, Binalonan',
    stops: [
      { name: 'Binalonan Crossing', info: 'Origin', time: '0 min' },
      { name: 'Laoac Junction', info: '3.1 km', time: '10 min' },
      { name: 'Manaoag Shrine', info: 'Destination', time: '18 min' },
    ],
    price: '₱25.00',
    icon: 'bus-side',
    color: theme.colors.iconJeep
  },
  {
    id: '4',
    title: 'Manaoag → Baguio',
    type: 'bus',
    terminal: 'Binalonan Bus Stop',
    terminalAddress: 'Poblacion, Binalonan',
    stops: [
      { name: 'Binalonan', info: 'Origin', time: '0 min' },
      { name: 'Pozorrubio', info: '12 km', time: '20 min' },
      { name: 'Sison', info: '25 km', time: '40 min' },
      { name: 'Camp 7', info: '52 km', time: '1h 15m' },
      { name: 'Baguio City', info: 'Destination', time: '1h 30m' },
    ],
    price: '₱120.00',
    icon: 'bus',
    color: theme.colors.iconBus
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'jeep', label: 'Jeepney', icon: 'bus-side' },
  { id: 'bus', label: 'Bus', icon: 'bus' },
  { id: 'uv', label: 'UV Express', icon: 'van-passenger' },
  { id: 'trike', label: 'Tricycle', icon: 'rickshaw' },
];

export const RatesScreen = () => {
  const [showLeftFade, setShowLeftFade] = React.useState(false);
  const [showRightFade, setShowRightFade] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedRoute, setExpandedRoute] = React.useState<string | null>(null);
  const [mapRoute, setMapRoute] = React.useState<any | null>(null);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    setShowLeftFade(contentOffset.x > 10);
    setShowRightFade(contentOffset.x < contentSize.width - layoutMeasurement.width - 10);
  };

  const filteredRoutes = ROUTE_DATA.filter(route => {
    const matchesCategory = activeCategory === 'all' || route.type === activeCategory;
    const matchesSearch = route.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          route.terminal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderRight = () => (
    <TouchableOpacity style={styles.notificationBtn}>
      <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
      <View style={styles.notificationBadge} />
    </TouchableOpacity>
  );

  return (
    <Screen title="RATES" rightComponent={renderRight()}>
      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          {/* 1. Your Location (Very Top) */}
          <View style={[styles.locationCard, { marginTop: theme.spacing.md }]}>
            <View style={styles.locationIconContainer}>
              <Ionicons name="location" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Your Location</Text>
              <Text style={styles.locationValue}>Manaoag, Pangasinan</Text>
            </View>
            <TouchableOpacity style={styles.changeBtn}>
              <MaterialCommunityIcons name="target" size={16} color={theme.colors.primary} />
              <Text style={styles.changeBtnText}>Update</Text>
            </TouchableOpacity>
          </View>

          {/* 2. Fuel Prices (Utility Section) */}
          <View style={[styles.sectionHeader, { marginTop: theme.spacing.sm }]}>
            <Text style={styles.sectionTitle}>Fuel Prices Today</Text>
            <View style={styles.sectionHeaderRight}>
              <Text style={styles.updatedText}>Updated: 7:30 AM</Text>
              <Ionicons name="information-circle-outline" size={14} color={theme.colors.textMuted} />
            </View>
          </View>
        </View>

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

        {/* 3. Search & Routes Section (Find a better UX) */}
        <View style={styles.routesSectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Transit Routes</Text>
              <Text style={styles.sectionSubtitle}>Find your transportation & terminals</Text>
            </View>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.colors.textMuted} />
            <TextInput
              placeholder="Search routes or terminals..."
              placeholderTextColor={theme.colors.textMuted}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryScroll}
            style={{ marginBottom: 16 }}
          >
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => setActiveCategory(cat.id)}
                style={[
                  styles.categoryChip, 
                  activeCategory === cat.id && styles.categoryChipActive
                ]}
              >
                <MaterialCommunityIcons 
                  name={cat.icon as any} 
                  size={16} 
                  color={activeCategory === cat.id ? '#fff' : theme.colors.textMuted} 
                />
                <Text style={[
                  styles.categoryLabel, 
                  activeCategory === cat.id && styles.categoryLabelActive
                ]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.transportList}>
            {filteredRoutes.map((route) => {
              const isExpanded = expandedRoute === route.id;
              return (
                <View key={route.id} style={styles.routeCardContainer}>
                  <TouchableOpacity 
                    style={[styles.routeCard, isExpanded && styles.routeCardExpanded]} 
                    activeOpacity={0.8}
                    onPress={() => setExpandedRoute(isExpanded ? null : route.id)}
                  >
                    <View style={[styles.routeIconContainer, { backgroundColor: route.color + '15' }]}>
                      <MaterialCommunityIcons name={route.icon as any} size={24} color={route.color} />
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeTitle}>{route.title}</Text>
                      <View style={styles.terminalRow}>
                        <Ionicons name="location-outline" size={12} color={theme.colors.textMuted} />
                        <Text style={styles.routeTerminal}>{route.terminal}</Text>
                      </View>
                    </View>
                    <View style={styles.routePriceContainer}>
                      <Text style={[styles.routePrice, { color: route.color }]}>{route.price}</Text>
                      <Ionicons 
                        name={isExpanded ? "chevron-up" : "chevron-forward"} 
                        size={18} 
                        color={theme.colors.textMuted} 
                      />
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <View style={styles.terminalDetails}>
                        <Text style={styles.detailsLabel}>TERMINAL LOCATION</Text>
                        <Text style={styles.terminalAddress}>{route.terminalAddress}</Text>
                        <View style={styles.actionButtonsRow}>
                          <TouchableOpacity style={styles.directionsBtn}>
                            <Ionicons name="navigate-outline" size={14} color="#fff" />
                            <Text style={styles.directionsBtnText}>Directions</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.mapViewBtn}
                            onPress={() => setMapRoute(route)}
                          >
                            <Ionicons name="map-outline" size={14} color={theme.colors.primary} />
                            <Text style={styles.mapViewBtnText}>Show Map</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.stopsSection}>
                        <View style={styles.stopsHeader}>
                          <Text style={styles.detailsLabel}>STATION SEQUENCE</Text>
                          <Text style={styles.stopsCount}>{route.stops.length} STOPS</Text>
                        </View>
                        
                        <View style={styles.timeline}>
                          {route.stops.map((stop, sIdx) => {
                            const isFirst = sIdx === 0;
                            const isLast = sIdx === route.stops.length - 1;
                            return (
                              <View key={stop.name} style={styles.timelineItem}>
                                <View style={styles.timelineMarker}>
                                  <View style={styles.markerDotContainer}>
                                    <View style={[
                                      styles.markerDot, 
                                      isFirst || isLast ? { backgroundColor: route.color, width: 14, height: 14, borderRadius: 7 } : { borderWidth: 2, borderColor: route.color }
                                    ]}>
                                      {isFirst && <Ionicons name="play" size={8} color="#fff" style={{ marginLeft: 1 }} />}
                                      {isLast && <Ionicons name="flag" size={8} color="#fff" />}
                                    </View>
                                  </View>
                                  {!isLast && <View style={[styles.markerLine, { backgroundColor: route.color + '40' }]} />}
                                </View>
                                
                                <View style={styles.stopInfo}>
                                  <View style={styles.stopTextRow}>
                                    <Text style={[
                                      styles.stopName,
                                      (isFirst || isLast) && styles.stopNamePrimary
                                    ]}>{stop.name}</Text>
                                    <Text style={styles.stopTime}>{stop.time}</Text>
                                  </View>
                                  <Text style={styles.stopDetailText}>{stop.info}</Text>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
            {filteredRoutes.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={theme.colors.border} />
                <Text style={styles.emptyStateText}>No routes found matching your search.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <View style={{ marginTop: 1 }}>
                <Ionicons name="information-circle-outline" size={14} color="#2563eb" />
              </View>
              <Text style={styles.footerText}>Transit information is based on current local records.</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.sourceText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Route Map Modal */}
      <Modal
        visible={!!mapRoute}
        animationType="slide"
        onRequestClose={() => setMapRoute(null)}
      >
        <View style={styles.modalContainer}>
          {/* Floating Header */}
          <View style={styles.floatingModalHeader}>
            <View style={styles.headerGlass}>
              <View>
                <Text style={styles.modalTitle}>{mapRoute?.title}</Text>
                <View style={styles.routeSummaryLine}>
                  <View style={[styles.typeMiniBadge, { backgroundColor: mapRoute?.color }]}>
                    <MaterialCommunityIcons name={mapRoute?.icon as any} size={10} color="#fff" />
                    <Text style={styles.typeMiniBadgeText}>{mapRoute?.type}</Text>
                  </View>
                  <Text style={styles.summaryDot}>•</Text>
                  <Text style={styles.summaryText}>{mapRoute?.price}</Text>
                  <Text style={styles.summaryDot}>•</Text>
                  <Text style={styles.summaryText}>{mapRoute?.stops[mapRoute.stops.length-1].time} total</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeGlassBtn} 
                onPress={() => setMapRoute(null)}
              >
                <Ionicons name="close" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fullMapWrapper}>
            <RouteMap route={mapRoute} />
            
            {/* Floating Sequence Deck */}
            <View style={styles.floatingSequenceDeck}>
              <View style={styles.deckHeader}>
                <Text style={styles.deckTitle}>Station Sequence</Text>
                <Text style={styles.deckCount}>{mapRoute?.stops.length} Stops</Text>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.deckTimelineScroll}
              >
                {mapRoute?.stops.map((stop: any, index: number) => (
                  <View key={index} style={styles.deckItem}>
                    <View style={styles.nodeConnector}>
                      <View style={[styles.deckLine, { 
                        backgroundColor: mapRoute.color + '30',
                        left: index === 0 ? '50%' : 0,
                        right: index === mapRoute.stops.length - 1 ? '50%' : 0,
                      }]} />
                      <View style={[styles.deckDot, { backgroundColor: mapRoute.color }]}>
                        <Text style={styles.deckDotText}>{index + 1}</Text>
                      </View>
                    </View>
                    <Text numberOfLines={1} style={styles.deckStationName}>{stop.name}</Text>
                    <Text style={styles.deckStationTime}>{stop.time}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contentScroll: {
    flex: 1,
  },
  headerSearchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 16,
    backgroundColor: theme.colors.background,
  },
  routesSectionContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: 32,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: theme.colors.text,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginLeft: 6,
  },
  categoryLabelActive: {
    color: '#fff',
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
    color: theme.colors.primary,
    marginLeft: 4,
  },
  viewMapText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '700',
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
  routeCardContainer: {
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  routeCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  routeCardExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: '#fafafa',
  },
  routeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  terminalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeTerminal: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginLeft: 4,
  },
  routePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routePrice: {
    fontSize: 15,
    fontWeight: '800',
    marginRight: 4,
  },
  expandedContent: {
    padding: 16,
    backgroundColor: '#fff',
  },
  terminalDetails: {
    marginBottom: 20,
  },
  detailsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  terminalAddress: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  directionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  directionsBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  mapViewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  mapViewBtnText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  stopsSection: {
    marginTop: 8,
  },
  stopsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stopsCount: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.primary,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeline: {
    marginTop: 8,
    paddingLeft: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 64, // Increased for better spacing
  },
  timelineMarker: {
    alignItems: 'center',
    width: 20,
    marginRight: 16,
  },
  markerDotContainer: {
    height: 20, // Match line height of stop name roughly
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  markerLine: {
    position: 'absolute',
    top: 20,
    bottom: -4,
    width: 2,
    backgroundColor: '#e2e8f0',
    zIndex: 1,
  },
  stopInfo: {
    flex: 1,
    paddingBottom: 24,
  },
  stopTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Better for multi-line names
  },
  stopName: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontWeight: '600',
    lineHeight: 20,
    flex: 1,
    paddingRight: 8,
  },
  stopNamePrimary: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  stopTime: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: 4,
  },
  stopDetailText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    opacity: 0.6,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
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
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  floatingModalHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  headerGlass: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.text,
  },
  routeSummaryLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  typeMiniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  typeMiniBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  summaryDot: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginHorizontal: 6,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  closeGlassBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullMapWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  floatingSequenceDeck: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  deckTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  deckCount: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  deckTimelineScroll: {
    paddingLeft: 20,
    paddingRight: 40,
  },
  deckItem: {
    width: 110,
    alignItems: 'center',
  },
  nodeConnector: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  deckLine: {
    position: 'absolute',
    height: 2,
    width: '100%',
    top: '50%',
    marginTop: -1,
  },
  deckDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 2.5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  deckDotText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  deckStationName: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  deckStationTime: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});
