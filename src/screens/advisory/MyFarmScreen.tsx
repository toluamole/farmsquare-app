import React from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import FsProgress from '../../components/common/FsProgress';
import FsBadge from '../../components/common/FsBadge';
import FsEmpty from '../../components/common/FsEmpty';
import FsButton from '../../components/common/FsButton';
import Icon from '../../components/common/Icon';

const defaultCrops = [
  {
    id: 'tomato',
    label: 'Tomato',
    plantingDate: '2026-05-12',
    currentStage: 'Flowering',
    week: 4,
    pct: 38,
    todayTask: 'Stake your tomato plants',
  },
];

export default function MyFarmScreen({ navigation }: { navigation: any }) {
  const app = useApp();
  const { profile } = app;

  const hasCrops = profile.crops && profile.crops.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-3 border-b border-line">
        <Text className="font-m-extrabold text-[22px] text-ink">My Farm</Text>
        <FsButton label="+ Add crop" size="sm" kind="outline" onPress={() => navigation.navigate('ProfileCrops')} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {!hasCrops ? (
          <View className="flex-1 pt-10">
            <FsEmpty
              icon="leaf"
              title="Set up your farm profile"
              sub="Add your crops to get a personalised planting calendar and daily task reminders."
              action="Set up now"
              onAction={() => navigation.navigate('ProfileCrops')}
            />
          </View>
        ) : (
          <View className="p-4">
            <Text className="font-p-semibold text-[11px] text-sub tracking-[0.5px] uppercase mb-3">Your enterprises</Text>

            {defaultCrops.map(crop => (
              <Pressable
                key={crop.id}
                className="bg-card rounded-md border border-line p-4 mb-3"
                style={shadows.card}
                onPress={() => navigation.navigate('Journey', { cropId: crop.id, plantingDate: crop.plantingDate })}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1 gap-3">
                    <View className="w-[52px] h-[52px] bg-limeTint rounded-sm items-center justify-center">
                      <Icon name="Sprout" size={26} color={colors.green} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-m-bold text-[16px] text-ink mb-[5px]">{crop.label}</Text>
                      <View className="flex-row">
                        <FsBadge tone="green">WEEK {crop.week} — {crop.currentStage.toUpperCase()}</FsBadge>
                      </View>
                    </View>
                  </View>
                  <Icon name="ChevronRight" size={20} color={colors.faint} />
                </View>

                <View className="flex-row items-center gap-[7px] bg-limeTint rounded-sm px-[10px] py-2 mb-3">
                  <Icon name="ClipboardList" size={15} color={colors.sub} />
                  <Text className="font-p-medium text-[12.5px] text-green flex-1" numberOfLines={1}>{crop.todayTask}</Text>
                </View>

                <View className="gap-[6px]">
                  <FsProgress pct={crop.pct} h={6} />
                  <View className="flex-row justify-between">
                    <Text className="font-p-regular text-[10.5px] text-sub">Season progress</Text>
                    <Text className="font-p-semibold text-[10.5px] text-green">{crop.pct}%</Text>
                  </View>
                </View>
              </Pressable>
            ))}

            {/* Add another crop */}
            <Pressable className="border-[1.5px] border-limeLine border-dashed rounded-md p-5 mt-1" onPress={() => navigation.navigate('ProfileCrops')}>
              <View className="flex-row items-center justify-center gap-[10px]">
                <View className="w-7 h-7 rounded-full bg-limeTint items-center justify-center">
                  <Text className="text-[18px] text-green leading-[22px] font-p-semibold">+</Text>
                </View>
                <Text className="font-p-semibold text-[13.5px] text-green">Add Another Crop</Text>
              </View>
            </Pressable>

            <View style={{ height: 32 }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
