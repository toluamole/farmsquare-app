import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { colors } from '../../theme';
import { useApp, PaymentMethod } from '../../context/AppContext';
import ScreenHeader from '../../components/layout/ScreenHeader';
import BottomSheet from '../../components/layout/BottomSheet';
import FsInput from '../../components/common/FsInput';
import FsButton from '../../components/common/FsButton';
import FsBadge from '../../components/common/FsBadge';
import FsEmpty from '../../components/common/FsEmpty';

const BLANK = { number: '', exp: '', cvv: '', name: '' };

const brandOf = (n: string) => {
  const d = n.replace(/\D/g, '');
  if (d.startsWith('4')) return 'Visa';
  if (d.startsWith('5')) return 'Mastercard';
  return 'Verve';
};

export default function PaymentsScreen() {
  const { payments, toast } = useApp();

  const [cards, setCards] = useState<PaymentMethod[]>(payments);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const setField = (key: keyof typeof BLANK, clean?: (v: string) => string) => (v: string) => {
    setForm(prev => ({ ...prev, [key]: clean ? clean(v) : v }));
    setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleSave = () => {
    const digits = form.number.replace(/\D/g, '');
    const next: Record<string, string | null> = {};
    if (digits.length < 16 || digits.length > 19) next.number = 'Card number must be 16–19 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.exp)) next.exp = 'Use MM/YY format';
    if (!/^\d{3}$/.test(form.cvv)) next.cvv = 'CVV must be 3 digits';
    if (Object.keys(next).length) { setErrors(next); return; }
    const card: PaymentMethod = {
      id: 'c' + Date.now(),
      bank: form.name.trim() || undefined,
      brand: brandOf(form.number),
      last4: digits.slice(-4),
      type: 'card',
    };
    setCards(prev => [...prev, card]);
    setSheetOpen(false);
    setForm(BLANK);
    setErrors({});
    toast('Card added');
  };

  const handleRemove = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    toast('Card removed');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={[]}>
      <ScreenHeader title="Payment Methods" />
      <ScrollView className="flex-1" contentContainerClassName="p-4 pt-[10px]" showsVerticalScrollIndicator={false}>
        {cards.length === 0 && (
          <FsEmpty icon="cart" title="No saved cards" sub="Add a card to make checkout faster." />
        )}
        {cards.map((c, i) => (
          <View key={c.id} className="bg-ink rounded-md p-[15px] mb-[10px] overflow-hidden">
            <View className="absolute -top-7 -right-7 w-[110px] h-[110px] rounded-full bg-[rgba(255,255,255,0.06)]" />
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-[7px]">
                <Icon name="CreditCard" size={17} color="rgba(255,255,255,0.85)" />
                <Text className="font-p-semibold text-[11.5px] text-[rgba(255,255,255,0.85)]">{c.bank ? `${c.bank}${c.brand ? ' · ' + c.brand : ''}` : c.brand}</Text>
              </View>
              {i === 0 && <FsBadge tone="green">DEFAULT</FsBadge>}
            </View>
            <Text className="font-m-bold text-[16px] text-white tracking-[2px] mt-[14px] mb-[10px]">•••• •••• •••• {c.last4}</Text>
            <View className="flex-row items-center justify-between">
              <Text className="font-p-regular text-[10px] text-[rgba(255,255,255,0.65)]">{c.type === 'card' ? 'Debit card' : 'Bank'}</Text>
              {cards.length > 1 && (
                <Pressable onPress={() => handleRemove(c.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Text className="font-p-semibold text-[10.5px] text-[#F0A8A0]">Remove</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}

        <Pressable className="flex-row items-center justify-center gap-2 border-[1.5px] border-limeLine border-dashed rounded-md py-[14px] mt-1" onPress={() => { setForm(BLANK); setErrors({}); setSheetOpen(true); }}>
          <Icon name="Plus" size={17} color={colors.green} />
          <Text className="font-p-semibold text-[12.5px] text-green">Add Card</Text>
        </Pressable>

        <View className="flex-row items-start gap-2 mt-3 px-[2px]">
          <Icon name="ShieldCheck" size={15} color={colors.green} style={{ marginTop: 1 }} />
          <Text className="flex-1 font-p-regular text-[10.5px] text-sub leading-4">Cards are tokenised with our payment partners (Paystack / Flutterwave). Farmsquare never stores your full card number.</Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Add a card">
        <FsInput label="Card number" value={form.number} onChangeText={setField('number', v => v.replace(/[^\d ]/g, '').slice(0, 23))} placeholder="5399 1234 5678 4821" type="tel" error={errors.number} />
        <View className="flex-row gap-[9px]">
          <View className="flex-1">
            <FsInput label="Expiry (MM/YY)" value={form.exp} onChangeText={setField('exp', v => v.replace(/[^\d/]/g, '').slice(0, 5))} placeholder="08/27" type="tel" error={errors.exp} />
          </View>
          <View className="flex-1">
            <FsInput label="CVV" value={form.cvv} onChangeText={setField('cvv', v => v.replace(/\D/g, '').slice(0, 3))} placeholder="123" type="password" error={errors.cvv} />
          </View>
        </View>
        <FsInput label="Bank / card name (optional)" value={form.name} onChangeText={setField('name')} placeholder="Zenith Bank" />
        <FsButton label="Save Card" full size="lg" onPress={handleSave} style={{ marginTop: 4 }} />
        <View style={{ height: 12 }} />
      </BottomSheet>
    </SafeAreaView>
  );
}
