import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { CustomTabBar } from './CustomTabBar';

// Import screens
import { MapsScreen } from '../modules/maps/MapsScreen';
import { RatesScreen } from '../modules/rates/RatesScreen';
import { TripsScreen } from '../modules/trips/TripsScreen';
import { HistoryScreen } from '../modules/history/HistoryScreen';
import { SettingsScreen } from '../modules/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Explore') {
              return <Ionicons name={focused ? 'compass' : 'compass-outline'} size={size} color={color} />;
            } else if (route.name === 'Rates') {
              return <MaterialCommunityIcons name={focused ? 'gas-station' : 'gas-station-outline'} size={size} color={color} />;
            } else if (route.name === 'History') {
              return <MaterialCommunityIcons name={focused ? 'history' : 'history'} size={size} color={color} />;
            } else if (route.name === 'Settings') {
              return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />;
            }
          },
        })}
      >
        <Tab.Screen name="Explore" component={MapsScreen} />
        <Tab.Screen name="Rates" component={RatesScreen} />
        <Tab.Screen name="Add Trip" component={TripsScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
