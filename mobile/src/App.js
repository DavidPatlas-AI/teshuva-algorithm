import React, {useEffect, useRef} from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import HomeScreen       from './screens/HomeScreen';
import InsightsScreen   from './screens/InsightsScreen';
import SettingsScreen   from './screens/SettingsScreen';
import ExplainScreen    from './screens/ExplainScreen';
import FloatingBubble   from './components/FloatingBubble';
import ConnectionBanner from './components/ConnectionBanner';

import {floatingService} from './services/FloatingService';
import {brainService}    from './services/BrainService';
import {COLORS}          from './styles/theme';

const Stack = createStackNavigator();

const NAV_THEME = {
  dark: true,
  colors: {
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

  useEffect(() => {
    floatingService.start();
    brainService.loadStats();
    brainService.loadMood();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

        <ConnectionBanner />

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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9000,
  },
});
