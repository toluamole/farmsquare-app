import React from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { cropLabel } from '../../services/advisory';
import FsEmpty from '../../components/common/FsEmpty';
import FsButton from '../../components/common/FsButton';
import Icon from '../../components/common/Icon';

const toISO = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export default function MyFarmScreen({ navigation }: { navigation: any }) {
  const app = useApp();
  const { profile } = app;

  const crops = profile.crops || [];
  const hasCrops = crops.length > 0;

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
              sub="Add your crops to get a planting calendar and stage-by-stage guidance."
              action="Set up now"
              onAction={() => navigation.navigate('ProfileCrops')}
            />
          </View>
        ) : (
          <View className="p-4">
            <Text className="font-p-semibold text-[11px] text-sub tracking-[0.5px] uppercase mb-3">Your enterprises</Text>

            {crops.map(cropId => (
              <Pressable
                key={cropId}
                className="bg-card rounded-md border border-line p-4 mb-3 flex-row items-center gap-3"
                style={shadows.card}
                onPress={() => navigation.navigate('Journey', { cropId, plantingDate: toISO(new Date()) })}
              >
                <View className="w-[52px] h-[52px] bg-limeTint rounded-sm items-center justify-center">
                  <Icon name="Sprout" size={26} color={colors.green} />
                </View>
                <View className="flex-1">
                  <Text className="font-m-bold text-[16px] text-ink mb-[3px]">{cropLabel(cropId)}</Text>
                  <Text className="font-p-regular text-[11.5px] text-sub">View growing guide</Text>
                </View>
                <Icon name="ChevronRight" size={20} color={colors.faint} />
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
