import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';

const MESSAGES = [
  'Checking pest database…',
  'Comparing with 1,200 similar cases…',
  'Matching treatments to your crop…',
];

export default function AnalyzingScreen({ navigation, route }: { navigation: any; route: any }) {
  const { crop, category } = route.params as { crop: string; category: string; description: string };
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const rotate = setInterval(() => setMsgIndex(i => (i + 1) % MESSAGES.length), 1200);
    const done = setTimeout(() => navigation.replace('Results', { crop, category }), 3500);
    return () => { clearInterval(rotate); clearTimeout(done); };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View className="flex-1 items-center justify-center px-11">
        <ActivityIndicator size="large" color={colors.green} />
        <Text className="font-m-bold text-[16px] text-ink text-center mt-[22px] min-h-[24px]">{MESSAGES[msgIndex]}</Text>
        <Text className="font-p-regular text-[11.5px] text-sub text-center mt-[6px]">This usually takes 5–10 seconds</Text>
      </View>
    </SafeAreaView>
  );
}
