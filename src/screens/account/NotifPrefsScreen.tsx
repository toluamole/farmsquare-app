import React, { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import ScreenHeader from '../../components/layout/ScreenHeader';

type Prefs = {
  orders: boolean; groupbuy: boolean; advisory: boolean; promos: boolean;
  push: boolean; sms: boolean; whatsapp: boolean;
};

const ALERT_ROWS: { key: keyof Prefs; title: string; sub: string }[] = [
  { key: 'orders', title: 'Order updates', sub: 'Payment, dispatch and delivery alerts' },
  { key: 'groupbuy', title: 'Group Buy alerts', sub: 'Deal filling fast, closing soon, shipping confirmed' },
  { key: 'advisory', title: 'Farm reminders', sub: 'Stage-by-stage tasks from your crop calendar' },
  { key: 'promos', title: 'Promotions & deals', sub: 'Discounts and seasonal offers' },
];

const CHANNEL_ROWS: { key: keyof Prefs; title: string; sub: string }[] = [
  { key: 'push', title: 'Push notifications', sub: 'In-app alerts' },
  { key: 'sms', title: 'SMS', sub: 'Text messages to your phone' },
  { key: 'whatsapp', title: 'WhatsApp', sub: 'Order receipts and farm reminders' },
];

export default function NotifPrefsScreen() {
  const { auth, toast } = useApp();

  const [prefs, setPrefs] = useState<Prefs>({
    orders: true, groupbuy: true, advisory: true, promos: false,
    push: true, sms: true, whatsapp: true,
  });

  const setPref = (key: keyof Prefs, value: boolean) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
    toast('Preferences saved');
  };

  const renderRows = (rows: { key: keyof Prefs; title: string; sub: string }[]) => (
    <View className="bg-card border border-line rounded-md overflow-hidden">
      {rows.map((row, i) => (
        <View key={row.key} className={cn('flex-row items-center gap-3 px-[14px] py-[13px]', i > 0 && 'border-t border-line')}>
          <View className="flex-1">
            <Text className="font-p-semibold text-[12.5px] text-ink">{row.title}</Text>
            <Text className="font-p-regular text-[10.5px] text-sub mt-[2px] leading-[15px]">{row.key === 'sms' && auth.phone ? `Text messages to ${auth.phone}` : row.sub}</Text>
          </View>
          <Switch value={prefs[row.key]} onValueChange={v => setPref(row.key, v)} trackColor={{ true: '#046307', false: '#D5D8CC' }} thumbColor="#fff" ios_backgroundColor="#D5D8CC" />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={[]}>
      <ScreenHeader title="Notification Preferences" />
      <ScrollView className="flex-1" contentContainerClassName="p-4 pt-[10px]" showsVerticalScrollIndicator={false}>
        {renderRows(ALERT_ROWS)}
        <Text className="font-p-semibold text-[11.5px] text-sub tracking-[0.5px] mt-4 mb-2">CHANNELS</Text>
        {renderRows(CHANNEL_ROWS)}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
