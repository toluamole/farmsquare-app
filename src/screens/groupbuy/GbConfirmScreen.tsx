import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import FsButton from '../../components/common/FsButton';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

export default function GbConfirmScreen({ navigation, route }: { navigation: any; route: any }) {
  const app = useApp();
  const { reservations, deals, toast } = app;

  const res = reservations.find(r => r.ref === route.params?.ref) || reservations[0];
  const deal = res ? deals.find(d => d.id === res.dealId) : undefined;

  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 12, speed: 7 }).start();
  }, []);

  if (!res || !deal) {
    return (
      <SafeAreaView className="flex-1 bg-green">
        <StatusBar barStyle="light-content" backgroundColor={colors.green} />
        <View className="flex-1 items-center justify-center gap-4 p-8">
          <Text className="font-p-medium text-[13px] text-[rgba(255,255,255,0.9)]">No reservation found.</Text>
          <FsButton kind="lime" label="Done" onPress={() => navigation.popToTop()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-green">
      <StatusBar barStyle="light-content" backgroundColor={colors.green} />
      <ScrollView className="flex-1" contentContainerClassName="grow pb-[26px]" showsVerticalScrollIndicator={false}>
        {/* Animated check */}
        <View className="items-center pt-11 px-[26px]">
          <Animated.View style={{ transform: [{ scale }] }} className="w-[88px] h-[88px] rounded-full bg-[rgba(255,255,255,0.18)] items-center justify-center">
            <View className="w-[60px] h-[60px] rounded-full bg-white items-center justify-center">
              <Icon name="Check" size={34} color={colors.green} />
            </View>
          </Animated.View>
          <Text className="font-m-extrabold text-[26px] text-white mt-[18px]">You’re in!</Text>
          <Text className="font-p-regular text-[12.5px] text-[rgba(255,255,255,0.88)] text-center leading-5 mt-2">
            You’ve reserved <Text className="font-p-bold text-white">{res.qty} {deal.unit}s</Text> of {deal.short}.{'\n'}
            We’ll notify you when the deal closes and your order ships.
          </Text>
          <View className="bg-[rgba(255,255,255,0.14)] rounded-lg px-[14px] py-[6px] mt-3">
            <Text className="font-m-bold text-[12.5px] text-white tracking-[0.5px]">Reservation #{res.ref}</Text>
          </View>
        </View>

        {/* Deal summary card */}
        <View className="bg-[rgba(255,255,255,0.14)] border border-[rgba(255,255,255,0.22)] rounded-lg mt-[22px] mx-5 px-4 py-1">
          {([
            ['Deal', deal.short],
            ['Quantity', `${res.qty} ${deal.unit}s`],
            ['Total paid', naira(res.total)],
            ['Expected delivery', deal.deliveryWindow],
          ] as [string, string][]).map(([k, v], i) => (
            <View key={k} className={cn('flex-row justify-between items-center gap-3 py-[9px]', i > 0 && 'border-t border-[rgba(255,255,255,0.14)]')}>
              <Text className="font-p-regular text-[12px] text-[rgba(255,255,255,0.78)]">{k}</Text>
              <Text className="font-p-semibold text-[12px] text-white shrink text-right" numberOfLines={2}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Share with friends */}
        <View className="bg-[rgba(255,255,255,0.12)] rounded-md mt-[14px] mx-5 px-[15px] py-[13px]">
          <Text className="font-p-semibold text-[12.5px] text-white">Help fill this deal faster</Text>
          <Text className="font-p-regular text-[11px] text-[rgba(255,255,255,0.8)] mt-[2px]">Share with your farming network and get your goods sooner.</Text>
          <FsButton full kind="whatsapp" label="Share on WhatsApp" style={{ marginTop: 11 }} onPress={() => toast(`“I just reserved ${res.qty} ${deal.unit}s at ${naira(deal.price)} — join me!” copied`)} />
        </View>

        {/* Actions */}
        <View className="mt-auto pt-[18px] px-5">
          <FsButton full size="lg" kind="lime" label="View My Order" onPress={() => navigation.navigate('GbOrder', { ref: res.ref })} />
          <Pressable className="self-center mt-[13px] py-[6px] px-[18px]" onPress={() => navigation.popToTop()}>
            <Text className="font-p-medium text-[12.5px] text-[rgba(255,255,255,0.85)]">Done</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
