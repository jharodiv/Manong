import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Text, Animated } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabItem = ({ route, isFocused, onPress, options, isMenuOpen, onLongPress, navigation, onSubAction }: any) => {
  const animatedScale = useRef(new Animated.Value(1)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const toValue = route.name === 'Add Trip' ? 1 : (isFocused ? 1.2 : 1);
    Animated.spring(animatedScale, {
      toValue,
      useNativeDriver: false,
      friction: 8,
      tension: 100,
    }).start();
  }, [isFocused, route.name]);

  useEffect(() => {
    Animated.spring(menuAnim, {
      toValue: isMenuOpen ? 1 : 0,
      useNativeDriver: false,
      friction: 7,
      tension: 80,
    }).start();
  }, [isMenuOpen]);

  const activeColor = '#6366f1';
  const inactiveColor = '#475569';

  if (route.name === 'Add Trip') {
    const micStyle = {
      transform: [
        { scale: menuAnim },
        { translateY: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }) },
        { translateX: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -55] }) },
      ],
      opacity: menuAnim,
    };

    const boltStyle = {
      transform: [
        { scale: menuAnim },
        { translateY: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] }) },
      ],
      opacity: menuAnim,
    };

    const gridStyle = {
      transform: [
        { scale: menuAnim },
        { translateY: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }) },
        { translateX: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 55] }) },
      ],
      opacity: menuAnim,
    };

    const rotateIcon = menuAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });

    return (
      <View style={styles.tabItem}>
        <AnimatedTouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSubAction('pin')}
          style={[styles.subButton, micStyle]}
        >
          <MaterialCommunityIcons name="map-marker-path" size={22} color="#6366f1" />
        </AnimatedTouchableOpacity>

        <AnimatedTouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSubAction('track')}
          style={[styles.subButton, boltStyle]}
        >
          <MaterialCommunityIcons name="radar" size={22} color="#6366f1" />
        </AnimatedTouchableOpacity>

        <AnimatedTouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSubAction('round')}
          style={[styles.subButton, gridStyle]}
        >
          <MaterialCommunityIcons name="swap-horizontal-bold" size={22} color="#6366f1" />
        </AnimatedTouchableOpacity>

        <TouchableOpacity
          style={styles.fab}
          onPress={onPress}
          onLongPress={onLongPress}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.fabInner, { transform: [{ rotate: rotateIcon }] }]}>
            <Ionicons name="add" size={30} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
        <Text style={[styles.label, { color: isFocused ? activeColor : inactiveColor }]}>ADD TRIP</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconWrapper, { transform: [{ scale: animatedScale }] }]}>
        {options.tabBarIcon({ focused: isFocused, color: isFocused ? activeColor : inactiveColor, size: 24 })}
      </Animated.View>
      <Text style={[styles.label, { color: isFocused ? activeColor : inactiveColor }]}>{route.name.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

export const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(backdropAnim, {
      toValue: isMenuOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen]);

  const line = `
    M0,20
    Q0,0 20,0
    L${SCREEN_WIDTH / 2 - 45},0
    C${SCREEN_WIDTH / 2 - 32},0 ${SCREEN_WIDTH / 2 - 30},32 ${SCREEN_WIDTH / 2},32
    C${SCREEN_WIDTH / 2 + 30},32 ${SCREEN_WIDTH / 2 + 32},0 ${SCREEN_WIDTH / 2 + 45},0
    L${SCREEN_WIDTH - 20},0
    Q${SCREEN_WIDTH},0 ${SCREEN_WIDTH},20
    L${SCREEN_WIDTH},70
    L0,70
    Z
  `;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSubAction = (mode: string) => {
    setIsMenuOpen(false);
    navigation.navigate('Add Trip', { mode });
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {isMenuOpen && (
        <Animated.View 
          style={[
            styles.backdrop, 
            { opacity: backdropAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }) }
          ]} 
        >
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={() => setIsMenuOpen(false)} 
          />
        </Animated.View>
      )}

      <Svg width={SCREEN_WIDTH} height={70} style={styles.svg}>
        <Path d={line} fill="#f5ededff" />
      </Svg>
      <View style={styles.content}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            if (isMenuOpen) {
              setIsMenuOpen(false);
              return;
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={route.name === 'Add Trip' ? toggleMenu : undefined}
              isMenuOpen={route.name === 'Add Trip' ? isMenuOpen : false}
              options={options}
              navigation={navigation}
              onSubAction={handleSubAction}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    height: 70,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  backdrop: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height,
    backgroundColor: '#000',
    zIndex: 1,
  },
  svg: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  content: {
    flexDirection: 'row',
    height: 70,
    paddingBottom: 10,
    marginTop: 0,
    zIndex: 3,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 2,
    position: 'relative',
  },
  iconWrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fab: {
    position: 'absolute',
    top: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
  },
  fabInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subButton: {
    position: 'absolute',
    top: -5,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
});
