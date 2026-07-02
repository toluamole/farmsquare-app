import React, { useEffect } from 'react';
import { View, Text, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import { diagnose } from '../../services/diagnosis';

export default function AnalyzingScreen({ navigation, route }: { navigation: any; route: any }) {
  const { crop, category, description } = route.params as { crop: string; category: string; description: string };

  useEffect(() => {
    let active = true;
    diagnose({ crop, category, description }).then(results => {
      if (active) navigation.replace('Results', { crop, category, results });
    });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View className="flex-1 items-center justify-center px-11">
        <ActivityIndicator size="large" color={colors.green} />
        <Text className="font-m-bold text-[16px] text-ink text-center mt-[22px] min-h-[24px]">Analyzing your description…</Text>
      </View>
    </SafeAreaView>
  );
}
