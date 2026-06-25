import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import FsButton from '../../components/common/FsButton';
import { useApp } from '../../context/AppContext';
import { FS_STATES, FS_LGAS } from '../../data/products';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileLoc'>;

function ProfileShell({ step, title, children, onContinue, continueLabel, canContinue, onSkip }: {
  step: number; title: string; children: React.ReactNode;
  onContinue: () => void; continueLabel?: string; canContinue?: boolean;
  onSkip: () => void;
}) {
  return (
    <View className="flex-1 bg-bg">
      <View className="flex-row justify-between items-center px-[22px] pt-[60px]">
        <View className="flex-row gap-[5px]">
          {[1, 2, 3].map(i => (
            <View key={i} className="h-2 rounded-full" style={{ width: i === step ? 24 : 8, backgroundColor: i <= step ? colors.green : '#D5D8CC' }} />
          ))}
        </View>
        <Pressable onPress={onSkip}>
          <Text className="font-p-medium text-[12px] text-sub">Skip for now</Text>
        </Pressable>
      </View>
      <Text className="font-p-medium text-[10.5px] text-sub px-[22px] pt-[14px]">STEP {step} OF 3</Text>
      <Text className="font-m-extrabold text-[21px] text-ink px-[22px] pt-1 pb-2">{title}</Text>
      <ScrollView className="flex-1 px-[22px]" showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      <View className="px-[22px] pb-24">
        <FsButton label={continueLabel || 'Continue'} onPress={onContinue} disabled={!canContinue} full size="lg" />
      </View>
    </View>
  );
}

export default function ProfileLocScreen({ navigation }: Props) {
  const { setProfile } = useApp();
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');

  const lgas = FS_LGAS[state] || ['Central', 'North', 'South'];

  return (
    <ProfileShell
      step={1}
      title="Where is your farm?"
      canContinue={!!state}
      onContinue={() => { setProfile({ state, lga }); navigation.replace('ProfileCrops'); }}
      onSkip={() => navigation.replace('ProfileCrops')}
    >
      <Text className="font-p-medium text-[11.5px] text-ink mb-2">State</Text>
      <View className="flex-row flex-wrap gap-2 mb-1">
        {FS_STATES.map(s => (
          <Pressable key={s} onPress={() => { setState(s); setLga(''); }} className={cn('border-[1.5px] rounded-full px-[14px] py-[7px]', state === s ? 'bg-limeTint border-green' : 'bg-card border-line')}>
            <Text className={cn('text-[12.5px]', state === s ? 'font-p-semibold text-green' : 'font-p-regular text-ink')}>{s}</Text>
          </Pressable>
        ))}
      </View>
      {state !== '' && (
        <>
          <Text className="font-p-medium text-[11.5px] text-ink mb-2 mt-4">Local Government Area</Text>
          <View className="flex-row flex-wrap gap-2 mb-1">
            {lgas.map(l => (
              <Pressable key={l} onPress={() => setLga(l)} className={cn('border-[1.5px] rounded-full px-[14px] py-[7px]', lga === l ? 'bg-limeTint border-green' : 'bg-card border-line')}>
                <Text className={cn('text-[12.5px]', lga === l ? 'font-p-semibold text-green' : 'font-p-regular text-ink')}>{l}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
      <Text className="font-p-regular text-[11.5px] text-sub leading-[17px] mt-4 mb-4">We use this to give you climate-appropriate farm advice and accurate Group Buy delivery fees.</Text>
    </ProfileShell>
  );
}
