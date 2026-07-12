import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import FsButton from '../../components/common/FsButton';
import Icon from '../../components/common/Icon';
import { useApp } from '../../context/AppContext';
import { useAppDispatch } from '../../store/hooks';
import { setEmailVerified } from '../../store/slices/authSlice';
import { sendVerificationEmail, reloadEmailVerified } from '../../services/firebase';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyEmail'>;

const RESEND_COOLDOWN_S = 60;

/**
 * Soft "check your inbox" gate shown right after email sign-up (A-4d). The
 * verification email was already sent by signUpWithEmail; this screen lets the
 * user confirm, resend, or skip — skipping keeps the Account-screen reminder.
 */
export default function VerifyEmailScreen({ navigation, route }: Props) {
  const { toast } = useApp();
  const dispatch = useAppDispatch();
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const continueToSetup = () => navigation.replace('ProfileLoc');

  const checkVerified = async () => {
    setChecking(true);
    const verified = await reloadEmailVerified();
    setChecking(false);
    if (verified) {
      dispatch(setEmailVerified(true));
      toast('Email verified 🎉');
      continueToSetup();
    } else {
      toast('Not verified yet — tap the link in your inbox (check spam too).');
    }
  };

  const resend = async () => {
    const res = await sendVerificationEmail();
    if (res.success) {
      setCooldown(RESEND_COOLDOWN_S);
      toast('Verification email sent.');
    } else {
      toast(res.error || 'Could not send the email. Try again.');
    }
  };

  return (
    <View className="flex-1 bg-bg px-[22px]">
      <View className="items-center mt-[52px] mb-9">
        <View className="w-[84px] h-[84px] rounded-full bg-limeTint items-center justify-center mb-4">
          <Icon name="Mail" size={38} color={colors.green} strokeWidth={2.25} />
        </View>
        <Text className="font-m-extrabold text-[21px] text-ink text-center mb-2">Check your inbox</Text>
        <Text className="font-p-regular text-[12.5px] text-sub text-center leading-[19px]">
          We sent a verification link to{'\n'}
          <Text className="font-p-semibold text-ink">{route.params.email}</Text>
          {'\n'}Tap the link, then come back here.
        </Text>
      </View>

      <FsButton label="I've verified my email" onPress={checkVerified} loading={checking} full size="lg" />

      <Pressable onPress={resend} disabled={cooldown > 0} className="items-center py-4">
        <Text
          className={
            cooldown > 0
              ? 'font-p-medium text-[12.5px] text-faint'
              : 'font-p-semibold text-[12.5px] text-green'
          }
        >
          {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend email'}
        </Text>
      </Pressable>

      <View className="mt-auto pb-[30px]">
        <Pressable onPress={continueToSetup} className="items-center py-1">
          <Text className="font-p-semibold text-[13px] text-sub">Skip for now</Text>
        </Pressable>
      </View>
    </View>
  );
}
