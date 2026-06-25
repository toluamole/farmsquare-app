// Must be imported before any code that constructs URL objects (e.g. Firebase),
// since React Native's built-in URL global lacks a complete implementation.
import 'react-native-url-polyfill/auto';
import './global.css';
import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { store, persistor } from './src/store';
import { useApp } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme';

function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <ActivityIndicator size="large" color={colors.green} />
    </View>
  );
}

function Toast() {
  const { toastMessage } = useApp();
  if (!toastMessage) return null;
  return (
    <View className="absolute bottom-24 left-0 right-0 items-center" pointerEvents="none">
      <View className="bg-ink rounded-full px-[18px] py-[11px] max-w-[86%]">
        <Text className="text-white font-p-medium text-[12.5px]">{toastMessage}</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) return <Loading />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <RootNavigator />
              <Toast />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
