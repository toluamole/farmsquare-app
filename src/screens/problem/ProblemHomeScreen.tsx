import React from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon, { IconName } from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import FsButton from '../../components/common/FsButton';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { FS_COMMON_PROBLEMS } from './diagnoses';

export default function ProblemHomeScreen({ navigation }: { navigation: any; route: any }) {
  const { toast } = useApp();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Farm Problem Solver" />

      <ScrollView className="flex-1" contentContainerClassName="p-4" showsVerticalScrollIndicator={false}>
        {/* Hero illustration */}
        <View className="items-center pt-[18px] pb-[22px] px-4">
          <View className="w-[116px] h-[116px] rounded-full bg-limeTint items-center justify-center mb-[18px]">
            <Icon name="Leaf" size={52} color={colors.green} />
          </View>
          <Text className="font-m-bold text-[19px] text-ink text-center leading-[25px]">Something wrong on your farm?</Text>
          <Text className="font-p-regular text-[12px] text-sub text-center leading-[18px] mt-2">Describe your problem and we’ll match it against thousands of solved cases to help you fix it fast.</Text>
        </View>

        <FsButton full size="lg" label="Diagnose My Problem" onPress={() => navigation.navigate('ProblemStep1')} />

        {/* Common problems */}
        <Text className="font-m-bold text-[14.5px] text-ink mt-[22px] mb-[9px]">Common problems</Text>
        <View className="bg-card border border-line rounded-md overflow-hidden">
          {FS_COMMON_PROBLEMS.map((p, i) => (
            <Pressable
              key={p.title}
              className={cn('flex-row items-center gap-[11px] px-[13px] py-3', i < FS_COMMON_PROBLEMS.length - 1 && 'border-b border-line')}
              onPress={() => toast('Full solution guides are coming soon — try Diagnose My Problem')}
            >
              <View className="w-9 h-9 rounded-full bg-limeTint items-center justify-center">
                <Icon name={p.icon as IconName} size={18} color={colors.green} />
              </View>
              <View className="flex-1">
                <Text className="font-p-semibold text-[12.5px] text-ink">{p.title}</Text>
                <Text className="font-p-regular text-[10.5px] text-sub mt-[1px]" numberOfLines={1}>{p.sub} · {p.crops}</Text>
              </View>
              <Icon name="ChevronRight" size={15} color={colors.faint} />
            </Pressable>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
