import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon, { IconName } from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import ScreenHeader from '../../components/layout/ScreenHeader';

const FAQS: [string, string][] = [
  ['How long does delivery take?', 'Lagos, Ogun and Oyo orders arrive in 1–2 working days. Most other states take 2–4 working days. You will get SMS and WhatsApp updates at every step, and you can track live from Account → My Orders.'],
  ["What happens if a Group Buy doesn't fill?", 'Your payment is held in escrow until the truck-load fills. If the deal closes without filling, you get a full refund to your original payment method within 3–5 working days — no deductions.'],
  ['Can I return a product?', 'Yes — sealed inputs (seeds, agrochemicals, fertilizer) can be returned within 7 days if unopened. Report damaged or wrong items within 48 hours of delivery and we will replace them free of charge.'],
  ['Is my payment secure?', 'Yes. Checkout is powered by Paystack and Flutterwave — cards, bank transfer, USSD and mobile money are all tokenised and PCI-DSS protected. Farmsquare never stores your full card details.'],
  ['How does Group Buy work?', 'Farmers reserve shares of a truck-load deal (e.g. NPK 50kg bags) at bulk price. Once the load fills, it ships to a pickup point near you. You save up to 25% versus retail, and escrow protects every naira.'],
];

function ContactRow({ icon, iconColor, iconBg, title, sub, onPress }: {
  icon: IconName; iconColor: string; iconBg: string; title: string; sub: string; onPress: () => void;
}) {
  return (
    <Pressable className="flex-row items-center gap-3 px-[14px] py-[13px]" onPress={onPress}>
      <View className="w-[38px] h-[38px] rounded-full items-center justify-center" style={{ backgroundColor: iconBg }}>
        <Icon name={icon} size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="font-p-semibold text-[12.5px] text-ink">{title}</Text>
        <Text className="font-p-regular text-[10.5px] text-sub mt-[1px]">{sub}</Text>
      </View>
      <Icon name="ChevronRight" size={16} color={colors.faint} />
    </Pressable>
  );
}

export default function SupportScreen() {
  const { toast } = useApp();
  const [open, setOpen] = useState(-1);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={[]}>
      <ScreenHeader title="Help & Support" />
      <ScrollView className="flex-1" contentContainerClassName="p-4 pt-[10px]" showsVerticalScrollIndicator={false}>
        {/* Contact actions */}
        <View className="bg-card border border-line rounded-md overflow-hidden">
          <ContactRow icon="MessageCircle" iconColor={colors.whatsapp} iconBg="#E6F7E9" title="Chat on WhatsApp" sub="Fastest — 9am–6pm, Mon–Sat" onPress={() => toast('Opens WhatsApp Business chat')} />
          <View className="h-px bg-line" />
          <ContactRow icon="Phone" iconColor={colors.green} iconBg={colors.limeTint} title="Call us" sub="0700-FARMSQR" onPress={() => toast('Dialling 0700-FARMSQR')} />
          <View className="h-px bg-line" />
          <ContactRow icon="CircleAlert" iconColor={colors.amberInk} iconBg={colors.amberTint} title="Report an order issue" sub="Wrong item, damage, payment issue" onPress={() => toast('Opens a support ticket form')} />
        </View>

        {/* FAQ accordion */}
        <Text className="font-p-semibold text-[11.5px] text-sub tracking-[0.5px] mt-4 mb-2">FREQUENTLY ASKED</Text>
        <View className="bg-card border border-line rounded-md overflow-hidden">
          {FAQS.map(([q, a], i) => (
            <View key={q} className={cn(i > 0 && 'border-t border-line')}>
              <Pressable className="flex-row items-center justify-between gap-[10px] px-[14px] py-3" onPress={() => setOpen(open === i ? -1 : i)}>
                <Text className="flex-1 font-p-medium text-[12px] text-ink leading-[17px]">{q}</Text>
                <Icon name={open === i ? 'ChevronUp' : 'ChevronDown'} size={15} color={colors.sub} />
              </Pressable>
              {open === i && <Text className="font-p-regular text-[11.5px] text-sub leading-[18px] px-[14px] pb-3">{a}</Text>}
            </View>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
