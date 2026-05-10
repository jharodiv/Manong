import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

export const TRANSPORT_TYPES = [
  { id: 'jeep', label: 'Jeepney', icon: 'bus-side', base: 13, perKm: 2, color: theme.colors.iconJeep },
  { id: 'trike', label: 'Tricycle', icon: 'rickshaw', base: 20, perKm: 5, color: theme.colors.iconTrike },
  { id: 'bus', label: 'Bus', icon: 'bus', base: 15, perKm: 2.5, color: theme.colors.iconBus },
  { id: 'uv', label: 'UV Express', icon: 'van-passenger', base: 60, perKm: 0, color: theme.colors.iconUV },
  { id: 'taxi', label: 'Taxi/Grab', icon: 'car', base: 45, perKm: 15, color: theme.colors.iconTaxi },
];

export const FareCalculator = ({ initialType }: { initialType?: string }) => {
  const [selectedType, setSelectedType] = useState(
    TRANSPORT_TYPES.find(t => t.id === initialType) || TRANSPORT_TYPES[0]
  );

  React.useEffect(() => {
    if (initialType) {
      const type = TRANSPORT_TYPES.find(t => t.id === initialType);
      if (type) setSelectedType(type);
    }
  }, [initialType]);

  const [distance, setDistance] = useState('1');
  const [passengerType, setPassengerType] = useState('regular');
  const [passengerCount, setPassengerCount] = useState(1);
  const [isFuelMode, setIsFuelMode] = useState(false);
  const [fuelEfficiency, setFuelEfficiency] = useState('12'); // km/L
  const [fuelPrice, setFuelPrice] = useState('63.50');

  const handleDistanceChange = (text: string) => {
    // Only allow numbers and one decimal point
    const validated = text.replace(/[^0-9.]/g, '');
    // Prevent multiple dots
    if ((validated.match(/\./g) || []).length > 1) return;
    setDistance(validated);
  };

  const handleFuelEfficiencyChange = (text: string) => {
    const validated = text.replace(/[^0-9.]/g, '');
    if ((validated.match(/\./g) || []).length > 1) return;
    setFuelEfficiency(validated);
  };

  const handleFuelPriceChange = (text: string) => {
    const validated = text.replace(/[^0-9.]/g, '');
    if ((validated.match(/\./g) || []).length > 1) return;
    setFuelPrice(validated);
  };

  const fare = useMemo(() => {
    const dist = parseFloat(distance) || 0;
    let baseFare = 0;
    
    if (selectedType.id === 'uv') {
      baseFare = selectedType.base;
    } else {
      // Base fare covers first 4km (standard in PH)
      baseFare = selectedType.base + (Math.max(0, dist - 4) * selectedType.perKm);
    }

    if (dist === 0 && selectedType.id !== 'uv') return 0;

    // Apply 20% discount for eligible groups
    if (['student', 'senior', 'pwd'].includes(passengerType)) {
      return (baseFare * 0.8) * passengerCount;
    }
    
    return baseFare * passengerCount;
  }, [selectedType, distance, passengerType, passengerCount]);

  const fuelCost = useMemo(() => {
    const dist = parseFloat(distance) || 0;
    const eff = parseFloat(fuelEfficiency) || 1;
    const price = parseFloat(fuelPrice) || 0;
    return (dist / eff) * price;
  }, [distance, fuelEfficiency, fuelPrice]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FARE CALCULATOR</Text>
        <TouchableOpacity 
          style={[styles.toggleBtn, isFuelMode && styles.toggleBtnActive]} 
          onPress={() => setIsFuelMode(!isFuelMode)}
        >
          <MaterialCommunityIcons 
            name={isFuelMode ? "gas-station" : "bus-clock"} 
            size={16} 
            color={isFuelMode ? "#fff" : theme.colors.textMuted} 
          />
          <Text style={[styles.toggleText, isFuelMode && styles.toggleTextActive]}>
            {isFuelMode ? 'Fuel Mode' : 'Transit Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      {!isFuelMode ? (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeScroll}>
            {TRANSPORT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType.id === type.id && { borderColor: type.color, backgroundColor: type.color + '10' }
                ]}
                onPress={() => setSelectedType(type)}
              >
                <MaterialCommunityIcons 
                  name={type.icon as any} 
                  size={24} 
                  color={selectedType.id === type.id ? type.color : theme.colors.textMuted} 
                />
                <Text style={[
                  styles.typeLabel,
                  selectedType.id === type.id && { color: type.color, fontWeight: '700' }
                ]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Distance (km)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={distance}
                  onChangeText={handleDistanceChange}
                  keyboardType="numeric"
                  placeholder="Enter distance..."
                  placeholderTextColor={theme.colors.textMuted + '80'}
                />
                <View style={styles.unitBadge}>
                  <Text style={styles.unitText}>km</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputLabel}>Passenger Details</Text>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity 
                    onPress={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                    style={styles.quantityBtn}
                  >
                    <Ionicons name="remove" size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{passengerCount}</Text>
                  <TouchableOpacity 
                    onPress={() => setPassengerCount(passengerCount + 1)}
                    style={styles.quantityBtn}
                  >
                    <Ionicons name="add" size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.passengerToggle}>
                {['regular', 'student', 'senior', 'pwd'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.passengerBtn,
                      passengerType === type && styles.passengerBtnActive
                    ]}
                    onPress={() => setPassengerType(type)}
                  >
                    <Text style={[
                      styles.passengerBtnText,
                      passengerType === type && styles.passengerBtnTextActive
                    ]}>
                      {type === 'regular' ? 'Regular' : type === 'student' ? 'Student' : type === 'senior' ? 'Senior' : 'PWD'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.resultCard}>
              <View style={{ flex: 1 }}>
                <View style={styles.resultLabelRow}>
                  <Text style={styles.resultLabel}>Estimated Fare</Text>
                  {passengerType !== 'regular' && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>20% OFF</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.infoIcon}>
                    <Ionicons name="information-circle-outline" size={12} color={selectedType.color} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.resultSublabel}>Based on current LTFRB rates</Text>
              </View>
              <View style={styles.resultValueColumn}>
                <Text style={[styles.resultValue, { color: selectedType.color }]}>
                  ₱{fare.toFixed(2)}
                </Text>
                <TouchableOpacity style={styles.actionLink}>
                  <Ionicons name="share-outline" size={14} color={selectedType.color} />
                  <Text style={[styles.actionLinkText, { color: selectedType.color }]}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.fuelContainer}>
          <View style={styles.fuelGrid}>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Distance</Text>
              <TextInput
                style={styles.input}
                value={distance}
                onChangeText={handleDistanceChange}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={[styles.inputWrapper, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.inputLabel}>Efficiency (km/L)</Text>
              <TextInput
                style={styles.input}
                value={fuelEfficiency}
                onChangeText={handleFuelEfficiencyChange}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          </View>
          
          <View style={[styles.inputWrapper, { marginTop: 0 }]}>
            <Text style={styles.inputLabel}>Gas Price (₱/L)</Text>
            <TextInput
              style={styles.input}
              value={fuelPrice}
              onChangeText={handleFuelPriceChange}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>

          <View style={[styles.resultCard, { backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }]}>
            <View style={{ flex: 1 }}>
              <View style={styles.resultLabelRow}>
                <Text style={styles.resultLabel}>Estimated Gas Cost</Text>
                <TouchableOpacity style={styles.infoIcon}>
                  <Ionicons name="information-circle-outline" size={12} color="#16a34a" />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultSublabel}>Based on trip distance</Text>
            </View>
            <View style={styles.resultValueColumn}>
              <Text style={[styles.resultValue, { color: '#16a34a' }]}>
                ₱{fuelCost.toFixed(2)}
              </Text>
              <TouchableOpacity style={styles.actionLink}>
                <Ionicons name="share-outline" size={14} color="#16a34a" />
                <Text style={[styles.actionLinkText, { color: '#16a34a' }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <View style={styles.footerInfo}>
        <Ionicons name="alert-circle-outline" size={12} color={theme.colors.textMuted} />
        <Text style={styles.footerInfoText}>
          Discounted rates require a valid ID (Student, Senior, or PWD).
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.text,
    letterSpacing: 1,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toggleBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginLeft: 4,
  },
  toggleTextActive: {
    color: '#fff',
  },
  typeScroll: {
    paddingBottom: 16,
    gap: 12,
  },
  typeCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    minWidth: 90,
  },
  typeLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
  inputGroup: {
    marginTop: 8,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  unitBadge: {
    marginLeft: -45,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  unitText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  passengerToggle: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 48,
  },
  passengerBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  passengerBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passengerBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  passengerBtnTextActive: {
    color: theme.colors.primary,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 2,
  },
  quantityBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '800',
    marginHorizontal: 8,
    color: theme.colors.text,
  },
  discountBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  discountText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#ef4444',
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginTop: 8,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text,
  },
  resultLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginLeft: 4,
  },
  resultSublabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  resultValueColumn: {
    alignItems: 'flex-end',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  actionLinkText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 2,
    textTransform: 'uppercase',
  },
  fuelContainer: {
    marginTop: 0,
  },
  fuelGrid: {
    flexDirection: 'row',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerInfoText: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginLeft: 6,
    fontWeight: '600',
  },
});
