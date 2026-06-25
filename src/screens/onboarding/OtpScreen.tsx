import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { cn } from '../../lib/utils';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { useApp } from '../../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

export default function OtpScreen({ navigation, route }: Props) {
  const { phone } = route.params;
  const { signIn } = useApp();
  const [code, setCode] = useState('');
  const [count, setCount] = useState(45);
  const [verifying, setVerifying] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const i = setInterval(() => setCount(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (code.length === 6 && !verifying) {
      setVerifying(true);
      setTimeout(() => {
        signIn({ name: 'Adaobi', phone });
        navigation.replace('ProfileLoc');
      }, 900);
    }
  }, [code]);

  return (
    <Pressable className="flex-1 bg-bg" onPress={() => inputRef.current?.focus()}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <View className="flex-1 px-[22px] pt-[10px]">
        <Text className="font-m-extrabold text-[20px] text-ink leading-[26px] mb-[26px]">Enter the code we sent to {phone}</Text>
        <TextInput
          ref={inputRef}
          autoFocus
          value={code}
          onChangeText={v => setCode(v.replace(/\D/g, '').slice(0, 6))}
          className="absolute opacity-0 w-0 h-0"
          keyboardType="number-pad"
        />
        <View className="flex-row gap-[9px]">
          {[...Array(6)].map((_, i) => (
            <View
              key={i}
              className={cn('flex-1 h-[52px] rounded-sm bg-field border-[1.8px] items-center justify-center', i === code.length ? 'border-green' : 'border-transparent')}
            >
              <Text className="font-m-bold text-[21px] text-ink">{code[i] || ''}</Text>
            </View>
          ))}
        </View>
        <View className="mt-[18px]">
          {verifying ? (
            <Text className="font-p-semibold text-[12px] text-green">Verifying…</Text>
          ) : count > 0 ? (
            <Text className="font-p-regular text-[12px] text-sub">Resend code in 0:{String(count).padStart(2, '0')}</Text>
          ) : (
            <Pressable onPress={() => setCount(45)}>
              <Text className="font-p-bold text-[12px] text-green">Resend Code</Text>
            </Pressable>
          )}
        </View>
        <View className="mt-[26px] bg-limeTint border border-limeLine rounded-md p-3">
          <Text className="font-p-regular text-[11.5px] text-sub leading-4">Type any 6 digits to continue (demo mode).</Text>
        </View>
      </View>
    </Pressable>
  );
}
