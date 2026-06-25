import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '../../lib/utils';
import Icon from '../../components/common/Icon';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import ScreenHeader from '../../components/layout/ScreenHeader';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

const REFERRAL_CODE = 'ADAOBI24';

const STEPS = [
  'Share your code with farming friends across Nigeria',
  'They sign up and place a first order of ₦5,000 or more',
  '₦1,000 lands in your wallet — and they get ₦1,000 off too',
];

export default function ReferralScreen() {
  const { toast } = useApp();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={[]}>
      <ScreenHeader title="Referral Programme" />
      <ScrollView className="flex-1" contentContainerClassName="p-4 pt-[10px]" showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <LinearGradient colors={[colors.green, colors.greenDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 16, paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center' }}>
          <Text className="font-p-regular text-[11.5px] text-[rgba(255,255,255,0.85)]">Earn for every farmer you bring</Text>
          <Text className="font-m-bold text-[23px] text-white mt-[5px] text-center">Give ₦1,000, Get ₦1,000</Text>
          <Text className="font-p-regular text-[10.5px] text-[rgba(255,255,255,0.8)] mt-[5px] leading-4 text-center">Friends get ₦1,000 off their first order — you earn ₦1,000 when they buy.</Text>
          <Pressable className="mt-[14px] self-center min-w-[200px] bg-[rgba(255,255,255,0.14)] border-[1.5px] border-[rgba(255,255,255,0.5)] border-dashed rounded-sm py-[10px] items-center" onPress={() => toast('Code copied!')}>
            <Text className="font-m-bold text-[17px] text-white tracking-[3px]">{REFERRAL_CODE}</Text>
            <Text className="font-p-regular text-[9.5px] text-[rgba(255,255,255,0.75)] mt-[2px]">Tap to copy</Text>
          </Pressable>
        </LinearGradient>

        {/* WhatsApp share */}
        <Pressable className="flex-row items-center justify-center gap-[9px] bg-whatsapp rounded-md py-[13px] mt-3" onPress={() => toast('Opens WhatsApp with your referral link')}>
          <Icon name="MessageCircle" size={18} color="#fff" />
          <Text className="font-p-semibold text-[13px] text-white">Share on WhatsApp</Text>
        </Pressable>

        {/* Stats row */}
        <Text className="font-p-semibold text-[11.5px] text-sub tracking-[0.5px] mt-[18px] mb-2">YOUR EARNINGS</Text>
        <View className="flex-row gap-[9px]">
          <View className="flex-1 bg-card border border-line rounded-md py-3 items-center">
            <Text className="font-m-bold text-[14px] text-green">{naira(4500)}</Text>
            <Text className="font-p-regular text-[10px] text-sub mt-[2px] text-center">Earned</Text>
          </View>
          <View className="flex-1 bg-card border border-line rounded-md py-3 items-center">
            <Text className="font-m-bold text-[14px] text-green">3</Text>
            <Text className="font-p-regular text-[10px] text-sub mt-[2px] text-center">Friends joined</Text>
          </View>
          <View className="flex-1 bg-card border border-line rounded-md py-3 items-center">
            <Text className="font-m-bold text-[14px] text-green">{naira(1500)}</Text>
            <Text className="font-p-regular text-[10px] text-sub mt-[2px] text-center">Pending</Text>
          </View>
        </View>

        {/* How it works */}
        <Text className="font-p-semibold text-[11.5px] text-sub tracking-[0.5px] mt-[18px] mb-2">HOW IT WORKS</Text>
        <View className="bg-card border border-line rounded-md px-[14px] py-1">
          {STEPS.map((step, i) => (
            <View key={i} className={cn('flex-row items-start gap-[11px] py-[11px]', i > 0 && 'border-t border-line')}>
              <View className="w-[22px] h-[22px] rounded-full bg-limeTint items-center justify-center mt-[1px]">
                <Text className="font-m-bold text-[11px] text-green">{i + 1}</Text>
              </View>
              <Text className="flex-1 font-p-regular text-[12px] text-ink leading-[18px]">{step}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
