import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import SplashScreen from '../screens/onboarding/SplashScreen';
import SlidesScreen from '../screens/onboarding/SlidesScreen';
import AuthGateScreen from '../screens/onboarding/AuthGateScreen';
import EmailAuthScreen from '../screens/onboarding/EmailAuthScreen';
import ProfileLocScreen from '../screens/onboarding/ProfileLocScreen';
import ProfileCropsScreen from '../screens/onboarding/ProfileCropsScreen';
import ProfileSizeScreen from '../screens/onboarding/ProfileSizeScreen';
import MainTabs from './MainTabs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signIn, signOut } from '../store/slices/authSlice';
import { subscribeToAuth } from '../services/firebase';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(s => s.auth);
  const cropSetup = useAppSelector(s => s.profile.cropSetup);

  // Keep latest auth in a ref so the auth-state listener avoids stale closures.
  const authRef = useRef(auth);
  authRef.current = auth;

  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAuth(user => {
      if (user) {
        // Sync the restored/Firebase session into Redux.
        dispatch(
          signIn({
            name: user.displayName || user.email?.split('@')[0] || 'Farmer',
            email: user.email || undefined,
            uid: user.uid,
          }),
        );
      } else if (authRef.current.signedIn && !authRef.current.guest) {
        // Firebase says signed out but Redux thought we were in — reconcile.
        dispatch(signOut());
      }
      setResolved(true);
    });
    return unsub;
  }, [dispatch]);

  // Hold a blank branded screen until the first auth-state callback resolves,
  // so logged-in users don't briefly flash the onboarding flow.
  if (!resolved) return <View className="flex-1 bg-bg" />;

  const initialRouteName: keyof RootStackParamList = auth.signedIn
    ? cropSetup
      ? 'Main'
      : 'ProfileLoc'
    : 'Splash';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Slides" component={SlidesScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="AuthGate" component={AuthGateScreen} />
      <Stack.Screen name="EmailAuth" component={EmailAuthScreen} />
      <Stack.Screen name="ProfileLoc" component={ProfileLocScreen} />
      <Stack.Screen name="ProfileCrops" component={ProfileCropsScreen} />
      <Stack.Screen name="ProfileSize" component={ProfileSizeScreen} />
      <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />
    </Stack.Navigator>
  );
}
