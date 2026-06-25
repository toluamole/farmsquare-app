import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import FsButton from '../../components/common/FsButton';
import FsInput from '../../components/common/FsInput';
import ScreenHeader from '../../components/layout/ScreenHeader';

const MAX_LEN = 500;
const PLACEHOLDER = 'The leaves are turning yellow and curling inward, starting from the bottom of the plant…';

export default function ProblemStep2Screen({ navigation, route }: { navigation: any; route: any }) {
  const { crop, category } = route.params as { crop: string; category: string };
  const { toast } = useApp();
  const [description, setDescription] = useState('');

  const canAnalyze = description.trim().length >= 10;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Describe what you see" subtitle="Step 2 of 2" />

      <ScrollView className="flex-1" contentContainerClassName="p-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-end gap-[9px]">
          <View className="flex-1">
            <FsInput
              label="Describe what you see"
              value={description}
              onChangeText={t => setDescription(t.slice(0, MAX_LEN))}
              placeholder={PLACEHOLDER}
              multiline
              numberOfLines={5}
              style={{ marginBottom: 0 }}
            />
          </View>
          <Pressable className="w-10 h-10 rounded-full bg-limeTint items-center justify-center mb-1" onPress={() => toast('Voice input is available in the mobile app')}>
            <Icon name="Mic" size={18} color={colors.green} />
          </Pressable>
        </View>
        <Text className="font-p-regular text-[10px] text-faint text-right mt-[5px]">{description.length}/{MAX_LEN}</Text>

        <Text className="font-p-semibold text-[12.5px] text-ink mt-4 mb-[9px]">Add photos <Text className="font-p-regular text-sub">(helps us diagnose faster)</Text></Text>
        <View className="flex-row gap-[9px]">
          {[0, 1, 2].map(i => (
            <Pressable key={i} className="w-20 h-20 rounded-sm border-[1.5px] border-limeLine border-dashed bg-limeTint items-center justify-center gap-1" onPress={() => toast('Photo capture is available in the mobile app')}>
              <Icon name="Camera" size={22} color={colors.green} />
              <Text className="font-p-semibold text-[9px] text-green">Add photo</Text>
            </Pressable>
          ))}
        </View>

        <View className="bg-limeTint border border-limeLine rounded-md px-[13px] py-[10px] mt-4">
          <Text className="font-p-regular text-[11px] text-sub leading-[17px]">Tip: photograph the whole plant, a close-up of affected leaves, and the underside of a leaf.</Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      <View className="px-4 pt-[10px] pb-4 bg-card border-t border-line">
        <FsButton full size="lg" label="Analyze My Problem" disabled={!canAnalyze} onPress={() => navigation.replace('Analyzing', { crop, category, description: description.trim() })} />
      </View>
    </SafeAreaView>
  );
}
