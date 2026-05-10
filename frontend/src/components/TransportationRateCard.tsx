import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface TransportationRateCardProps {
  title: string;
  details: string[];
  price: string;
  iconName: any;
  iconColor: string;
  iconType?: 'ionicons' | 'material';
}

export const TransportationRateCard: React.FC<TransportationRateCardProps> = ({ 
  title, details, price, iconName, iconColor, iconType = 'material' 
}) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        {iconType === 'material' ? (
          <MaterialCommunityIcons name={iconName} size={28} color={iconColor} />
        ) : (
          <Ionicons name={iconName} size={28} color={iconColor} />
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        {details.map((detail, index) => (
          <Text key={index} style={styles.detail}>{detail}</Text>
        ))}
      </View>
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: iconColor }]}>{price}</Text>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: 10, // Refined from 16
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  detail: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 4,
  },
});
