import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import ScreenHeader from '../../components/layout/ScreenHeader';
import FsEmpty from '../../components/common/FsEmpty';
import ProductImage from '../../components/common/ProductImage';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

const STAGES: [string, string][] = [
  ['RESERVED', 'Your portion is secured and payment is held in escrow'],
  ['DEAL CLOSED', 'The truck-load fills and the deal locks in'],
  ['PACKING', 'Goods are packed at the depot for bulk dispatch'],
  ['DISPATCHED', 'The truck is on its way to your state'],
  ['DELIVERED', 'Pick up or receive your goods'],
];

export default function GbOrderScreen({ navigation, route }: { navigation: any; route: any }) {
  const app = useApp();
  const { reservations, deals } = app;

  const res = reservations.find(r => r.ref === route.params?.ref) || reservations[0];
  const deal = res ? deals.find(d => d.id === res.dealId) : undefined;

  if (!res || !deal) {
    return (
      <View className="flex-1 bg-bg">
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        <ScreenHeader title="My Group Buy Order" />
        <FsEmpty icon="group" title="No reservations" sub="Join a Group Buy deal to see it here." action="Back" onAction={() => navigation.goBack()} />
      </View>
    );
  }

  const activeStep = 0;

  return (
    <View className="flex-1 bg-bg">
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScreenHeader title="My Group Buy Order" subtitle={`Ref #${res.ref}`} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-3 pb-6" showsVerticalScrollIndicator={false}>
        {/* Status stepper */}
        <View className="bg-card border border-line rounded-md p-[14px]" style={shadows.card}>
          <Text className="font-p-semibold text-[10px] text-sub tracking-[0.4px] mb-3">ORDER STATUS</Text>
          {STAGES.map(([label, sub], i) => {
            const active = i === activeStep;
            const last = i === STAGES.length - 1;
            return (
              <View key={label} className="flex-row">
                <View className="items-center w-6 mr-[11px]">
                  <View className={cn('w-6 h-6 rounded-full items-center justify-center', active ? 'bg-green' : 'bg-field border border-line')}>
                    {active ? <Icon name="Check" size={14} color={colors.white} /> : <Text className="font-p-semibold text-[10px] text-faint">{i + 1}</Text>}
                  </View>
                  {!last && <View className="flex-1 w-[2px] bg-line my-[3px]" />}
                </View>
                <View className={cn('flex-1 pt-[2px]', !last && 'pb-4')}>
                  <Text className={cn('font-p-bold text-[11px] tracking-[0.4px]', active ? 'text-green' : 'text-faint')}>{label}</Text>
                  <Text className="font-p-regular text-[10.5px] text-sub leading-[15px] mt-[2px]">{sub}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Reservation summary */}
        <View className="bg-card border border-line rounded-md p-[14px] mt-[10px]" style={shadows.card}>
          <View className="flex-row items-center gap-3 pb-3 border-b border-line">
            <ProductImage productId={deal.product} style={{ width: 58, height: 58, borderRadius: 10 }} />
            <View className="flex-1">
              <Text className="font-p-semibold text-[12.5px] text-ink leading-[17px]">{deal.title}</Text>
              <Text className="font-p-regular text-[11px] text-sub mt-[2px]">{deal.short}</Text>
            </View>
          </View>
          {([
            ['Quantity', `${res.qty} ${deal.unit}s`],
            ['Unit price', `${naira(deal.price)} per ${deal.unit}`],
            ['Total paid', naira(res.total)],
          ] as [string, string][]).map(([k, v]) => (
            <View key={k} className="flex-row justify-between items-center pt-[10px]">
              <Text className="font-p-regular text-[11.5px] text-sub">{k}</Text>
              <Text className="font-p-semibold text-[11.5px] text-ink">{v}</Text>
            </View>
          ))}
        </View>

        {/* Escrow protection */}
        <View className="bg-limeTint border border-limeLine rounded-md p-[13px] mt-[10px] flex-row gap-[11px] items-start">
          <Icon name="ShieldCheck" size={20} color={colors.green} style={{ marginTop: 1 }} />
          <View className="flex-1">
            <Text className="font-p-semibold text-[12px] text-ink">Escrow protection</Text>
            <Text className="font-p-regular text-[11px] text-sub leading-4 mt-[2px]">Your payment is held securely and only released when the deal closes successfully. If it doesn’t fill, you get a full refund within 3–5 working days.</Text>
          </View>
        </View>

        {/* Delivery */}
        <View className="bg-card border border-line rounded-md mt-[10px] overflow-hidden" style={shadows.card}>
          <View className="p-[13px] flex-row gap-[11px] items-start">
            <Icon name="Bus" size={20} color={colors.green} style={{ marginTop: 1 }} />
            <View className="flex-1">
              <Text className="font-p-semibold text-[11.5px] text-ink leading-[17px]">Predicted delivery: {deal.deliveryWindow}</Text>
              <Text className="font-p-regular text-[10.5px] text-sub leading-4 mt-[2px]">{deal.states}</Text>
            </View>
          </View>
          <View className="bg-amberTint border-t border-line px-[13px] py-[10px] flex-row gap-[9px] items-start">
            <Icon name="Bell" size={15} color={colors.amberInk} style={{ marginTop: 1 }} />
            <Text className="flex-1 font-p-medium text-[10.5px] text-amberInk leading-4">We’ll reach out with your confirmed delivery date as soon as the order is filled and shipping is available.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
