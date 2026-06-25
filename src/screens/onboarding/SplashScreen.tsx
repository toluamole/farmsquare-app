import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme';
import Icon from '../../components/common/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const { auth } = useApp();
  const scale = new Animated.Value(0.85);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      if (auth.signedIn) navigation.replace('Main');
      else navigation.replace('Slides');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-green items-center justify-center gap-[18px]">
      <Animated.View style={[styles.logoCard, { transform: [{ scale }], opacity }]}>
        <Icon name="Sprout" size={42} color={colors.green} strokeWidth={2.25} />
        <Text className="font-m-extrabold text-[20px] text-green tracking-[-0.5px]">Farmsquare</Text>
      </Animated.View>
      <Text className="font-m-semibold text-[14px] text-[rgba(255,255,255,0.92)] tracking-[0.4px]">Your Farm. Your Future.</Text>
      <View className="absolute bottom-14 flex-row gap-[5px]">
        {[0, 1, 2].map(i => (
          <View key={i} className="w-[7px] h-[7px] rounded-full bg-[rgba(255,255,255,0.85)]" />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 26,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 40,
    elevation: 16,
    gap: 4,
  },
});
