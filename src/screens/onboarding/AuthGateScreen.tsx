import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import FsButton from '../../components/common/FsButton';
import Icon from '../../components/common/Icon';
import { useApp } from '../../context/AppContext';
import { useGoogleAuth, isGoogleConfigured } from '../../services/googleAuth';
import type { AuthUser } from '../../services/firebase';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthGate'>;

export default function AuthGateScreen({ navigation }: Props) {
  const { signIn, browseAsGuest, cropSetup } = useApp();
  const [error, setError] = useState<string | null>(null);

  const onGoogleSuccess = (user: AuthUser) => {
    signIn({
      name: user.displayName || user.email?.split('@')[0] || 'Farmer',
      email: user.email || undefined,
      uid: user.uid,
    });
    navigation.replace(cropSetup ? 'Main' : 'ProfileLoc');
  };

  const { promptGoogle, ready } = useGoogleAuth({ onSuccess: onGoogleSuccess, onError: setError });

  const handleGuest = () => {
    browseAsGuest();
    navigation.replace('Main');
  };

  return (
    <View className="flex-1 bg-bg px-[22px]">
      <View className="items-center mt-[52px] mb-9">
        <View className="w-[84px] h-[84px] rounded-full bg-limeTint items-center justify-center mb-4">
          <Icon name="Sprout" size={40} color={colors.green} strokeWidth={2.25} />
        </View>
        <Text className="font-m-extrabold text-[21px] text-ink text-center leading-7 mb-2">Join thousands of{'\n'}Nigerian farmers</Text>
        <Text className="font-p-regular text-[12.5px] text-sub text-center">Shop inputs, join bulk deals, grow with guidance.</Text>
      </View>
      <View className="gap-[11px]">
        <FsButton label="Sign Up with Email" onPress={() => navigation.push('EmailAuth', { mode: 'signup' })} full size="lg" />
        {isGoogleConfigured && (
          <FsButton label="Continue with Google" onPress={() => { setError(null); promptGoogle(); }} disabled={!ready} kind="secondary" full size="lg" />
        )}
      </View>
      {error && <Text className="font-p-regular text-[11.5px] text-red text-center mt-3">{error}</Text>}
      <View className="flex-row items-center gap-3 my-[22px]">
        <View className="flex-1 h-px bg-line" />
        <Text className="font-p-regular text-[11px] text-faint">or</Text>
        <View className="flex-1 h-px bg-line" />
      </View>
      <Pressable onPress={handleGuest} className="items-center py-1">
        <Text className="font-p-semibold text-[13px] text-green">Browse as Guest</Text>
      </Pressable>
      <View className="mt-auto pb-[30px] items-center">
        <Text className="font-p-regular text-[12px] text-sub">
          Already have an account?{' '}
          <Text className="font-p-bold text-green" onPress={() => navigation.push('EmailAuth', { mode: 'login' })}>Log In</Text>
        </Text>
      </View>
    </View>
  );
}
