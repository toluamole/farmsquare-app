import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import FsButton from '../../components/common/FsButton';
import { useApp } from '../../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSize'>;

const SIZE_OPTIONS = [
  'Less than 1 hectare',
  '1–5 hectares',
  '5–20 hectares',
  '20–100 hectares',
  'More than 100 hectares',
  "I don't have a farm yet",
];

export default function ProfileSizeScreen({ navigation }: Props) {
  const { setProfile, finishSetup } = useApp();
  const [size, setSize] = useState('');

  const finish = () => {
    setProfile({ size });
    finishSetup();
    navigation.replace('Main');
  };

  return (
    <View className="flex-1 bg-bg">
      <View className="flex-row justify-between items-center px-[22px] pt-[14px]">
        <View className="flex-row gap-[5px]">
          {[1, 2, 3].map(i => (
            <View key={i} className="h-2 rounded-full" style={{ width: i === 3 ? 24 : 8, backgroundColor: i <= 3 ? colors.green : '#D5D8CC' }} />
          ))}
        </View>
        <Pressable onPress={finish}>
          <Text className="font-p-medium text-[12px] text-sub">Skip for now</Text>
        </Pressable>
      </View>
      <Text className="font-p-medium text-[10.5px] text-sub px-[22px] pt-[14px]">STEP 3 OF 3</Text>
      <Text className="font-m-extrabold text-[21px] text-ink px-[22px] pt-1 pb-2">How big is your farm?</Text>
      <ScrollView className="flex-1 px-[22px]" showsVerticalScrollIndicator={false}>
        <View className="gap-[9px] pt-2">
          {SIZE_OPTIONS.map(o => {
            const active = size === o;
            return (
              <Pressable key={o} onPress={() => setSize(o)} className={cn('flex-row items-center gap-3 bg-card border-[1.5px] rounded-md py-[13px] px-[15px]', active ? 'bg-limeTint border-green' : 'border-line')}>
                <View className={cn('w-[19px] h-[19px] rounded-full border-2 items-center justify-center', active ? 'border-green' : 'border-faint')}>
                  {active && <View className="w-[9px] h-[9px] rounded-full bg-green" />}
                </View>
                <Text className={cn('text-[13px] text-ink flex-1', active ? 'font-p-semibold' : 'font-p-regular')}>{o}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View className="px-[22px] pb-7">
        <FsButton label="Finish Setup" onPress={finish} disabled={!size} full size="lg" />
      </View>
    </View>
  );
}
