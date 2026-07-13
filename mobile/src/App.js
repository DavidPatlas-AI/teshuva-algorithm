import React, {useEffect, useRef, useState} from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import HomeScreen       from './screens/HomeScreen';
import InsightsScreen   from './screens/InsightsScreen';
import SettingsScreen   from './screens/SettingsScreen';
import ExplainScreen    from './screens/ExplainScreen';
import FloatingBubble   from './components/FloatingBubble';

import {floatingService} from './services/FloatingService';
import {brainService}    from './services/BrainService';
import {COLORS}          from './styles/theme';

const Stack = createStackNavigator();

const NAV_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary:      COLORS.accent,
    background:   COLORS.bg,
    card:         COLORS.surface,
    text:         COLORS.text,
    border:       COLORS.border,
    notification: COLORS.accent,
  },
};

const SCREEN_OPTIONS = {
  headerStyle:      {backgroundColor: COLORS.surface},
  headerTintColor:  COLORS.text,
  headerTitleStyle: {fontWeight: '700'},
  headerBackTitle:  'חזרה',
  headerTitleAlign: 'center',
  cardStyleInterpolator: ({current}) => ({
    cardStyle: {opacity: current.progress},
  }),
};

export default function App() {
  const navRef = useRef(null);
  const [brainReady, setBrainReady] = useState(false);

  useEffect(() => {
    floatingService.start();
    // Screens read/mutate brain state synchronously — they must not mount
    // until the persisted state has finished loading from AsyncStorage,
    // otherwise an early observe()/getStats() call can race the load and
    // silently lose data (load() overwrites in-memory state with disk state).
    brainService.init().then(() => setBrainReady(true));
  }, []);

  if (!brainReady) {
    return (
      <View style={[styles.root, styles.loading]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

        <NavigationContainer theme={NAV_THEME} ref={navRef}>
          <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{title: 'האלגוריתם שחזר בתשובה'}}
            />
            <Stack.Screen
              name="Insights"
              component={InsightsScreen}
              options={{title: 'תובנות שבועיות'}}
            />
            <Stack.Screen
              name="Explain"
              component={ExplainScreen}
              options={{title: 'למה אני רואה את זה?'}}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{title: 'הגדרות'}}
            />
          </Stack.Navigator>
        </NavigationContainer>

        {/*
          FloatingBubble is rendered OUTSIDE NavigationContainer so it floats
          above all screens. It manages its own MascotMenu internally.
          We pass navRef so menu items can navigate.
        */}
        <View style={styles.overlay} pointerEvents="box-none">
          <FloatingBubble navigation={navRef.current} />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.bg},
  loading: {alignItems: 'center', justifyContent: 'center'},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9000,
  },
});
