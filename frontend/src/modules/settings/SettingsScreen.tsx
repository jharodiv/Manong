import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { theme } from '../../theme';

const CustomSwitch = ({ value, onValueChange }: { value: boolean, onValueChange: (v: boolean) => void }) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e2e8f0', '#2563eb'],
  });

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => onValueChange(!value)}
    >
      <Animated.View style={[styles.switchTrack, { backgroundColor }]}>
        <Animated.View style={[styles.switchThumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const SettingItem = ({ icon, iconBg, title, subtitle, rightElement, isLast, onPress, color }: any) => (
  <TouchableOpacity 
    style={[styles.settingItem, !isLast && styles.borderBottom]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
      {typeof icon === 'string' ? (
        <Ionicons name={icon as any} size={20} color={color || theme.colors.primary} />
      ) : (
        icon
      )}
    </View>
    <View style={styles.settingTextContainer}>
      <Text style={[styles.settingTitle, color && title === 'Log Out' ? { color } : {}]}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {rightElement || <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />}
  </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
);

export const SettingsScreen = () => {
  const [isLightMode, setIsLightMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  const renderTitle = () => (
    <View>
      <Text style={styles.headerTitle}>SETTINGS</Text>
      <Text style={styles.headerSubtitle}>Manage your preferences and app settings</Text>
    </View>
  );

  const renderRight = () => (
    <TouchableOpacity style={styles.notificationBtn}>
      <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
      <View style={styles.notificationBadge} />
    </TouchableOpacity>
  );

  return (
    <Screen title={renderTitle()} rightComponent={renderRight()}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.9}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=juan' }} 
              style={styles.avatar} 
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Juan Dela Cruz</Text>
            <Text style={styles.profileEmail}>juan.delacruz@email.com</Text>
            <View style={styles.badgeContainer}>
              <MaterialCommunityIcons name="crown" size={12} color={theme.colors.primary} />
              <Text style={styles.badgeText}>Free User</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>

        {/* Location */}
        <SectionHeader title="Location" />
        <View style={styles.card}>
          <SettingItem
            icon="location"
            iconBg="#eff6ff"
            color="#2563eb"
            title="Current Location"
            subtitle="Manaoag, Pangasinan"
            isLast={true}
            rightElement={
              <View style={styles.changeBtnContainer}>
                <TouchableOpacity style={styles.changeBtn}>
                  <Text style={styles.changeBtnText}>Change</Text>
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
              </View>
            }
          />
        </View>

        {/* Preferences */}
        <SectionHeader title="Preferences" />
        <View style={styles.card}>
          <SettingItem
            icon="sunny-outline"
            iconBg="#fffbeb"
            color="#f59e0b"
            title="Appearance"
            subtitle={isLightMode ? "Light Mode" : "Dark Mode"}
            rightElement={
              <CustomSwitch 
                value={isLightMode} 
                onValueChange={setIsLightMode}
              />
            }
          />
          <SettingItem
            icon="language-outline"
            iconBg="#ecfdf5"
            color="#10b981"
            title="Language"
            subtitle="English"
          />
          <SettingItem
            icon={
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#8b5cf6' }}>₱</Text>
            }
            iconBg="#f5f3ff"
            title="Currency"
            subtitle="Philippine Peso (PHP)"
          />
          <SettingItem
            icon="ruler-outline"
            iconBg="#eff6ff"
            color="#3b82f6"
            title="Distance Unit"
            subtitle="Kilometers (km)"
            isLast={true}
          />
        </View>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <View style={styles.card}>
          <SettingItem
            icon="notifications-outline"
            iconBg="#f3e8ff"
            color="#a855f7"
            title="Notifications"
            subtitle="Manage alerts and updates"
            isLast={true}
            rightElement={
              <CustomSwitch 
                value={notifications} 
                onValueChange={setNotifications}
              />
            }
          />
        </View>

        {/* Data & History */}
        <SectionHeader title="Data & History" />
        <View style={styles.card}>
          <SettingItem
            icon="star-outline"
            iconBg="#fff7ed"
            color="#f97316"
            title="Saved Routes"
            subtitle="View and manage your favorite routes"
          />
          <SettingItem
            icon="trash-outline"
            iconBg="#fef2f2"
            color="#ef4444"
            title="Clear History"
            subtitle="Clear recent searches and history"
            isLast={true}
          />
        </View>

        {/* Support */}
        <SectionHeader title="Support" />
        <View style={styles.card}>
          <SettingItem
            icon="headset-outline"
            iconBg="#f0fdfa"
            color="#0d9488"
            title="Help Center"
            subtitle="FAQs and how-to guides"
          />
          <SettingItem
            icon="chatbubble-outline"
            iconBg="#eff6ff"
            color="#3b82f6"
            title="Contact Support"
            subtitle="Get help from our team"
          />
          <SettingItem
            icon="flag-outline"
            iconBg="#fffbeb"
            color="#d97706"
            title="Report Incorrect Fare"
            subtitle="Help us keep rates accurate"
            isLast={true}
          />
        </View>

        {/* About */}
        <SectionHeader title="About" />
        <View style={styles.card}>
          <SettingItem
            icon="information-circle-outline"
            iconBg="#f8fafc"
            color="#64748b"
            title="About App"
            subtitle="Version 1.0.0"
          />
          <SettingItem
            icon="shield-checkmark-outline"
            iconBg="#f0fdf4"
            color="#22c55e"
            title="Privacy Policy"
            subtitle="How we protect your data"
          />
          <SettingItem
            icon="document-text-outline"
            iconBg="#f5f3ff"
            color="#a855f7"
            title="Terms of Use"
            subtitle="Read our terms and conditions"
          />
          <SettingItem
            icon="exit-outline"
            iconBg="#fef2f2"
            color="#ef4444"
            title="Log Out"
            isLast={true}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  notificationBtn: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
    borderWidth: 1.5,
    borderColor: theme.colors.background,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  profileEmail: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    marginLeft: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
    marginLeft: 4,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  settingSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  changeBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  switchTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    padding: 2,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
