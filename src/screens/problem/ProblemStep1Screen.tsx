import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon, { IconName } from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import { FS_CROPS } from '../../data/products';
import FsButton from '../../components/common/FsButton';
import FsChip from '../../components/common/FsChip';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { PROBLEM_CATEGORIES } from '../../services/diagnosis';

const BASE_CROPS = ['tomato', 'maize', 'pepper', 'cassava', 'rice'];

const cropLabel = (id: string) => {
  const found = FS_CROPS.find(([cid]) => cid === id);
  return found ? found[1] : id.charAt(0).toUpperCase() + id.slice(1);
};

export default function ProblemStep1Screen({ navigation }: { navigation: any; route: any }) {
  const { profile } = useApp();
  const [crop, setCrop] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const cropIds = Array.from(new Set([...(profile.crops || []), ...BASE_CROPS]));

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScreenHeader title="What’s affected?" subtitle="Step 1 of 2" />

      <ScrollView className="flex-1" contentContainerClassName="p-4" showsVerticalScrollIndicator={false}>
        <Text className="font-p-semibold text-[12.5px] text-ink mb-[10px]">Which crop has the problem?</Text>
        <View className="flex-row flex-wrap gap-2">
          {cropIds.map(id => (
            <FsChip key={id} label={cropLabel(id)} active={crop === id} onPress={() => setCrop(id)} />
          ))}
        </View>

        <Text className="font-p-semibold text-[12.5px] text-ink mb-[10px] mt-[22px]">What kind of problem?</Text>
        <View className="flex-row flex-wrap justify-between">
          {PROBLEM_CATEGORIES.map(cat => {
            const active = category === cat.id;
            return (
              <Pressable key={cat.id} className={cn('w-[48.5%] flex-row items-center gap-[10px] bg-card border-[1.5px] rounded-md px-3 py-[13px] mb-[9px]', active ? 'bg-limeTint border-green' : 'border-line')} onPress={() => setCategory(cat.id)}>
                <Icon name={cat.icon as IconName} size={19} color={active ? colors.green : colors.sub} />
                <Text className={cn('flex-1 text-[11.5px] leading-[15px]', active ? 'font-p-semibold text-green' : 'font-p-medium text-ink')} numberOfLines={2}>{cat.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      <View className="px-4 pt-[10px] pb-4 bg-card border-t border-line">
        <FsButton full size="lg" label="Continue" disabled={!crop || !category} onPress={() => navigation.navigate('ProblemStep2', { crop, category })} />
      </View>
    </SafeAreaView>
  );
}
