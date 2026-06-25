import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import FsButton from '../../components/common/FsButton';
import FsChip from '../../components/common/FsChip';
import { useApp } from '../../context/AppContext';
import { FS_CROPS } from '../../data/products';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileCrops'>;

const FARMING_TYPES = ['Crop Farmer', 'Livestock Farmer', 'Mixed', 'Aspiring Farmer'];

export default function ProfileCropsScreen({ navigation }: Props) {
  const { setProfile } = useApp();
  const [types, setTypes] = useState<string[]>(['Crop Farmer']);
  const [crops, setCrops] = useState<string[]>(['tomato']);

  const toggleType = (t: string) => {
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };
  const toggleCrop = (id: string) => {
    setCrops(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  return (
    <View className="flex-1 bg-bg">
      <View className="flex-row justify-between items-center px-[22px] pt-[60px]">
        <View className="flex-row gap-[5px]">
          {[1, 2, 3].map(i => (
            <View key={i} className="h-2 rounded-full" style={{ width: i === 2 ? 24 : 8, backgroundColor: i <= 2 ? colors.green : '#D5D8CC' }} />
          ))}
        </View>
        <Pressable onPress={() => navigation.replace('ProfileSize')}>
          <Text className="font-p-medium text-[12px] text-sub">Skip for now</Text>
        </Pressable>
      </View>
      <Text className="font-p-medium text-[10.5px] text-sub px-[22px] pt-[14px]">STEP 2 OF 3</Text>
      <Text className="font-m-extrabold text-[21px] text-ink px-[22px] pt-1 pb-2">What do you grow?</Text>
      <ScrollView className="flex-1 px-[22px]" showsVerticalScrollIndicator={false}>
        <Text className="font-p-medium text-[11.5px] text-ink mb-[9px]">Farming type</Text>
        <View className="flex-row flex-wrap gap-2">
          {FARMING_TYPES.map(t => (
            <FsChip key={t} label={t} active={types.includes(t)} onPress={() => toggleType(t)} />
          ))}
        </View>
        <Text className="font-p-medium text-[11.5px] text-ink mb-[9px] mt-5">Crop interests <Text className="font-p-regular text-sub">(up to 5)</Text></Text>
        <View className="flex-row flex-wrap gap-[9px]">
          {FS_CROPS.slice(0, 9).map(([id, label]) => {
            const active = crops.includes(id);
            return (
              <Pressable
                key={id}
                onPress={() => toggleCrop(id)}
                className={cn('w-[30%] border-[1.5px] rounded-md py-[10px] px-1 items-center gap-[6px]', active ? 'bg-limeTint border-green' : 'bg-card border-line')}
              >
                <View className={cn('w-[34px] h-[34px] rounded-full items-center justify-center', active ? 'bg-green' : 'bg-field')}>
                  <Text className={cn('font-m-bold text-[15px]', active ? 'text-white' : 'text-sub')}>{label.charAt(0).toUpperCase()}</Text>
                </View>
                <Text className={cn('text-[10.5px] text-center', active ? 'font-p-semibold text-green' : 'font-p-medium text-ink')}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>
      <View className="px-[22px] pb-7">
        <FsButton label="Continue" onPress={() => { setProfile({ types, crops }); navigation.replace('ProfileSize'); }} full size="lg" />
      </View>
    </View>
  );
}
