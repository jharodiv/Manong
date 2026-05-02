import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface ScreenProps {
  title: string | React.ReactNode;
  children?: React.ReactNode;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const Screen: React.FC<ScreenProps> = ({ title, children, onBackPress, rightComponent }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              {onBackPress && (
                <TouchableOpacity onPress={onBackPress} style={{ marginRight: 12 }}>
                  <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }}>
                {typeof title === 'string' ? (
                  <Text style={styles.title}>{title.toUpperCase()}</Text>
                ) : (
                  title
                )}
              </View>
            </View>
            {rightComponent && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {rightComponent}
              </View>
            )}
          </View>
        </View>
        <View style={styles.content}>
          {children || (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{typeof title === 'string' ? title : 'Content'} Coming Soon</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: theme.colors.textMuted,
    fontSize: 16,
  }
});
