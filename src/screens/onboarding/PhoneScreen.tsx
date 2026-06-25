import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import FsInput from '../../components/common/FsInput';
import FsButton from '../../components/common/FsButton';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { sendPhoneOTP } from '../../services/firebase';

type Props = NativeStackScreenProps<RootStackParamList, 'Phone'>;

function formatPhone(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 10);
  return digits.replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));
}

export default function PhoneScreen({ navigation }: Props) {
  const [num, setNum] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const digits = num.replace(/\D/g, '');
  const valid = digits.length === 10;

  const handleSendOTP = async () => {
    if (!valid) return;
    setLoading(true);
    setError(null);
    const fullPhone = '+234' + digits;
    const result = await sendPhoneOTP(fullPhone);
    setLoading(false);
    if (result.success && result.verificationId) {
      navigation.push('Otp', { phone: '+234 ' + formatPhone(num) });
    } else {
      setError(result.error || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader onBack={() => navigation.goBack()} />
      <View className="flex-1 px-[22px] pt-[10px]">
        <Text className="font-m-extrabold text-[21px] text-ink mb-[6px]">Enter your phone number</Text>
        <Text className="font-p-regular text-[12.5px] text-sub mb-6">We'll send you a verification code by SMS.</Text>
        <FsInput
          value={formatPhone(num)}
          onChangeText={setNum}
          placeholder="803 555 0147"
          type="tel"
          prefix={
            <View className="flex-row items-center pr-[10px] border-r border-line">
              <Text className="font-p-medium text-[13.5px] text-ink">🇳🇬 +234</Text>
            </View>
          }
          error={num && !valid ? 'Enter a 10-digit number, e.g. 803 555 0147' : error}
          hint={!num ? 'Standard SMS rates may apply' : undefined}
        />
      </View>
      <View className="px-[22px] pb-7">
        <FsButton label="Send OTP" onPress={handleSendOTP} disabled={!valid} loading={loading} full size="lg" />
      </View>
    </View>
  );
}
