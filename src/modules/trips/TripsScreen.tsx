import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { theme } from '../../theme';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  largeTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: theme.colors.text,
  },
  rightToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarIcon: {
    marginLeft: 20,
  },
});

export const TripsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const mode = route.params?.mode;

  const handleBack = () => {
    navigation.setParams({ mode: undefined });
  };

  const getTitle = () => {
    if (!mode) return <Text style={styles.largeTitle}>TRIPS</Text>;

    const modeLabels: any = {
      pin: 'PIN - START TO FINISH',
      track: 'AUTO TRACK',
      round: 'ROUND TRIP',
    };

    return (
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>TRIPS</Text>
        <Text style={styles.subTitle}>{modeLabels[mode] || mode.toUpperCase()}</Text>
      </View>
    );
  };

  const renderRight = () => {
    if (!mode) return null;
    return (
      <View style={styles.rightToolbar}>
        <TouchableOpacity style={styles.toolbarIcon}>
          <Ionicons name="share-outline" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarIcon}>
          <Ionicons name="chatbubble-outline" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarIcon}>
          <Ionicons name="ellipsis-horizontal" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Screen 
      title={getTitle()} 
      onBackPress={mode ? handleBack : undefined}
      rightComponent={renderRight()}
    />
  );
};
