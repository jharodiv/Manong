import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { theme } from '../theme';

interface FuelRateCardProps {
  company: string;
  price: number;
  logoUrl?: string;
}

export const FuelRateCard: React.FC<FuelRateCardProps> = ({ company, price, logoUrl }) => {
  return (
    <View style={styles.card}>
      <View style={styles.logoContainer}>
        {logoUrl ? (
          <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoPlaceholderText}>{company[0]}</Text>
          </View>
        )}
      </View>
      <Text style={styles.companyName}>{company.toUpperCase()}</Text>
      <Text style={styles.price}>₱{price.toFixed(2)}</Text>
      <Text style={styles.unit}>/ Liter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 115, // Refined from 120
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 12, // Refined from 16
    marginRight: 12, // Refined from 16
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 60,
    height: 40,
    marginBottom: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  companyName: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  unit: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
});
