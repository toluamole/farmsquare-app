import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import FsBadge from '../../components/common/FsBadge';
import FsButton from '../../components/common/FsButton';
import FsProgress from '../../components/common/FsProgress';
import FsEmpty from '../../components/common/FsEmpty';
import ProductImage from '../../components/common/ProductImage';
import QtyControl from '../../components/common/QtyControl';
import { useCountdown } from '../../components/common/CountdownTimer';
import BottomSheet from '../../components/layout/BottomSheet';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

function CountdownCells({ target }: { target: number }) {
  const { d, h, m, s, done } = useCountdown(target);
  if (done) return <Text className="font-p-semibold text-[11px] text-red">CLOSED</Text>;

  const cells: [string, string][] = [[d, 'Days'], [h, 'Hrs'], [m, 'Min'], [s, 'Sec']];
  return (
    <View className="flex-row gap-[5px]">
      {cells.map(([val, label]) => (
        <View key={label} className="bg-ink rounded-[7px] px-[7px] py-[5px] items-center min-w-[38px]">
          <Text className="font-m-bold text-[15px] text-white leading-[18px]">{val}</Text>
          <Text className="font-p-medium text-[7.5px] text-[rgba(255,255,255,0.65)] leading-[10px]">{label}</Text>
        </View>
      ))}
    </View>
  );
}

const FAQS: [string, string][] = [
  ['What if the deal doesn’t fill?', 'Your payment is held safely in escrow until the deal closes. If the deal doesn’t reach its minimum, you get a full refund within 3–5 working days.'],
  ['When do I pay?', 'Immediately, to secure your share. Your payment is held in escrow and only released to Farmsquare when the deal closes successfully.'],
  ['How is it delivered?', 'Once the truck-load fills, goods are dispatched in bulk to a hub in your state. We’ll share your confirmed delivery date and pickup or doorstep options after the deal closes.'],
  ['Can I change my quantity?', 'Yes — you can adjust or cancel your reservation any time before the deal closes. After closing, the truck is committed and changes aren’t possible.'],
];

export default function DealDetailScreen({ navigation, route }: { navigation: any; route: any }) {
  const insets = useSafeAreaInsets();
  const app = useApp();
  const { deals, t0, addDealToCart, toast } = app;

  const deal = deals.find(d => d.id === route.params?.id);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [qty, setQty] = useState(deal ? deal.min : 1);
  const [faqOpen, setFaqOpen] = useState(0);

  if (!deal) {
    return (
      <View className="flex-1 bg-bg">
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        <FsEmpty icon="zap" title="Deal not found" sub="This deal may have ended or been removed." action="Back to Group Buy" onAction={() => navigation.goBack()} />
      </View>
    );
  }

  const pct = Math.round((deal.reserved / deal.total) * 100);
  const save = Math.round((1 - deal.price / deal.retail) * 100);
  const left = deal.total - deal.reserved;
  const maxQty = Math.min(deal.max, Math.max(deal.min, left || deal.max));
  const isActive = deal.status === 'active';
  const isUpcoming = deal.status === 'upcoming';
  const isClosed = deal.status === 'closed';

  const status = isUpcoming ? 'COMING SOON' : isClosed ? 'CLOSED' : pct >= 85 ? 'ALMOST FULL' : pct >= 60 ? 'FILLING FAST' : 'OPEN';
  const statusTone: 'gray' | 'solid' | 'green' = !isActive ? 'gray' : pct >= 60 ? 'solid' : 'green';

  const openSheet = () => { setQty(deal.min); setSheetOpen(true); };

  const steps: [string, string][] = [
    ['Reserve & pay securely', `Pick your ${deal.unit}s — payment held in escrow`],
    ['Deal fills up', `Farmers join until all ${deal.total} ${deal.unit}s are reserved`],
    ['Bulk delivery to your state', deal.deliveryWindow],
  ];

  return (
    <View className="flex-1 bg-bg">
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-4">
        {/* Hero */}
        <View>
          <ProductImage productId={deal.product} style={{ height: 240, width: '100%', borderRadius: 0 }} />
          <View className="absolute left-[14px] right-[14px] flex-row justify-between" style={{ top: insets.top + 8 }}>
            <Pressable className="w-[38px] h-[38px] rounded-full bg-card items-center justify-center" style={shadows.card} onPress={() => navigation.goBack()}>
              <Icon name="ArrowLeft" size={20} color={colors.ink} />
            </Pressable>
            <Pressable className="w-[38px] h-[38px] rounded-full bg-card items-center justify-center" style={shadows.card} onPress={() => toast('Deal link copied — share it!')}>
              <Icon name="Share2" size={19} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        {/* Body */}
        <View className="bg-bg rounded-t-lg -mt-4 px-4 pt-[15px]">
          <View className="flex-row gap-[7px]">
            <FsBadge tone={statusTone}>{status}</FsBadge>
            {!isClosed && <FsBadge tone="green">SAVE {save}%</FsBadge>}
          </View>

          <Text className="font-m-bold text-[18.5px] text-ink leading-6 mt-[10px]">{deal.title}</Text>
          <Text className="font-p-regular text-[11.5px] text-sub mt-1">{deal.total}-{deal.unit} truck · wholesale direct · NAFDAC certified</Text>

          {/* Pricing */}
          <View className="flex-row items-baseline gap-[9px] mt-3">
            <Text className="font-m-extrabold text-[30px] text-green">{naira(deal.price)}</Text>
            <Text className="font-p-regular text-[14px] text-faint line-through">{naira(deal.retail)}</Text>
            <Text className="font-p-regular text-[11.5px] text-sub">per {deal.unit}</Text>
          </View>

          {/* Countdown */}
          {isActive && deal.closeOffset != null && (
            <View className="bg-card border border-line rounded-md mt-[13px] p-[13px] flex-row items-center justify-between">
              <View className="shrink mr-2">
                <Text className="font-p-semibold text-[10px] text-sub tracking-[0.4px]">DEAL CLOSES IN</Text>
                {deal.closeLabel ? <Text className="font-p-regular text-[10.5px] text-sub mt-[3px]">{deal.closeLabel}</Text> : null}
              </View>
              <CountdownCells target={t0 + deal.closeOffset} />
            </View>
          )}
          {isUpcoming && (
            <View className="bg-card border border-line rounded-md mt-[13px] p-[13px] flex-row items-center justify-between">
              <View className="shrink mr-2">
                <Text className="font-p-semibold text-[10px] text-sub tracking-[0.4px]">DEAL OPENS IN</Text>
                {deal.closeLabel ? <Text className="font-p-regular text-[10.5px] text-sub mt-[3px]">{deal.closeLabel}</Text> : null}
              </View>
              {deal.openOffset != null ? <CountdownCells target={t0 + deal.openOffset} /> : <Text className="font-p-regular text-[10.5px] text-sub mt-[3px]">opens soon</Text>}
            </View>
          )}
          {isClosed && (
            <View className="bg-field rounded-md mt-[13px] p-[13px] flex-row items-center gap-2">
              <Icon name="Lock" size={15} color={colors.sub} />
              <Text className="font-p-medium text-[11.5px] text-sub flex-1">This deal has closed{deal.closedLabel ? ` · ${deal.closedLabel}` : ''}</Text>
            </View>
          )}

          {/* Progress */}
          {!isUpcoming && (
            <View className="bg-card border border-line rounded-md mt-[9px] p-[13px]">
              <FsProgress pct={pct} h={10} />
              <View className="flex-row justify-between mt-2">
                <Text className="font-p-regular text-[11px] text-sub"><Text className="font-p-semibold text-ink">{deal.reserved}/{deal.total}</Text> {deal.unit}s reserved</Text>
                <Text className="font-p-regular text-[11px] text-sub"><Text className="font-p-semibold text-ink">{deal.farmers}</Text> farmers participating</Text>
              </View>
              {isActive && pct > 60 && (
                <View className="mt-[9px] bg-amberTint rounded-sm px-[11px] py-[7px] flex-row items-center gap-[7px]">
                  <Icon name="Zap" size={13} color={colors.amberInk} />
                  <Text className="font-p-medium text-[11px] text-amberInk flex-1">Only {left} {deal.unit}s left — filling fast!</Text>
                </View>
              )}
            </View>
          )}

          {/* How it works */}
          <Text className="font-m-bold text-[14.5px] text-ink mt-5 mb-[9px]">How it works</Text>
          <View className="flex-row gap-2">
            {steps.map(([t, s], i) => (
              <View key={t} className="flex-1 bg-card border border-line rounded-md py-[11px] px-[9px] items-center">
                <View className="w-8 h-8 rounded-full bg-limeTint items-center justify-center">
                  <Text className="font-m-extrabold text-[13px] text-green">{i + 1}</Text>
                </View>
                <Text className="font-p-semibold text-[10.5px] text-ink mt-[6px] text-center leading-[14px]">{t}</Text>
                <Text className="font-p-regular text-[9px] text-sub mt-[2px] text-center leading-3">{s}</Text>
              </View>
            ))}
          </View>

          {/* Product details */}
          <Text className="font-m-bold text-[14.5px] text-ink mt-5 mb-[9px]">Product details</Text>
          {deal.details ? <Text className="font-p-regular text-[12px] text-sub leading-[19px]">{deal.details}</Text> : null}
          <Pressable className="flex-row items-center gap-[3px] mt-2 self-start" onPress={() => navigation.navigate('ShopTab', { screen: 'Product', params: { id: deal.product } })}>
            <Text className="font-p-semibold text-[12px] text-green">View full product listing</Text>
            <Icon name="ChevronRight" size={14} color={colors.green} />
          </Pressable>

          {/* Delivery */}
          <Text className="font-m-bold text-[14.5px] text-ink mt-5 mb-[9px]">Delivery</Text>
          <View className="bg-card border border-line rounded-md overflow-hidden">
            <View className="p-3 flex-row gap-[11px] items-start">
              <Icon name="Bus" size={20} color={colors.green} style={{ marginTop: 1 }} />
              <View className="flex-1">
                <Text className="font-p-semibold text-[11.5px] text-ink leading-[17px]">Predicted delivery: {deal.deliveryWindow}</Text>
                <Text className="font-p-regular text-[10.5px] text-sub leading-4 mt-[2px]">This is a predicted window — Group Buy ships once the truck-load fills.</Text>
              </View>
            </View>
            <View className="bg-amberTint border-t border-line px-3 py-[10px] flex-row gap-[9px] items-start">
              <Icon name="Bell" size={15} color={colors.amberInk} style={{ marginTop: 1 }} />
              <Text className="flex-1 font-p-medium text-[10.5px] text-amberInk leading-4">We’ll reach out with your confirmed delivery date as soon as the order is filled and shipping is available.</Text>
            </View>
            <View className="border-t border-line p-3 flex-row gap-[11px] items-start">
              <Icon name="MapPin" size={16} color={colors.sub} style={{ marginTop: 1 }} />
              <View className="flex-1">
                <Text className="font-p-semibold text-[10.5px] text-ink">Available states</Text>
                <Text className="font-p-regular text-[10.5px] text-sub leading-4 mt-[1px]">{deal.states}</Text>
              </View>
            </View>
          </View>

          {/* FAQs */}
          <Text className="font-m-bold text-[14.5px] text-ink mt-5 mb-[9px]">FAQs</Text>
          <View className="bg-card border border-line rounded-md overflow-hidden">
            {FAQS.map(([q, a], i) => (
              <View key={q} className={cn(i > 0 && 'border-t border-line')}>
                <Pressable className="flex-row items-center justify-between px-[14px] py-3 gap-2" onPress={() => setFaqOpen(faqOpen === i ? -1 : i)}>
                  <Text className="flex-1 font-p-medium text-[12px] text-ink">{q}</Text>
                  <Icon name={faqOpen === i ? 'ChevronUp' : 'ChevronDown'} size={15} color={colors.sub} />
                </Pressable>
                {faqOpen === i && <Text className="font-p-regular text-[11.5px] text-sub leading-[17px] px-[14px] pb-3">{a}</Text>}
              </View>
            ))}
          </View>

          {/* Share */}
          <View className="mt-4 mb-[6px] bg-limeTint border border-limeLine rounded-md p-[13px]">
            <Text className="font-p-semibold text-[12.5px] text-ink">Help fill this truck faster</Text>
            <Text className="font-p-regular text-[11px] text-sub mt-[2px]">{deal.farmers} farmers have already reserved — share with your network.</Text>
            <View className="flex-row gap-2 mt-[10px] items-center">
              <FsButton kind="whatsapp" label="Share on WhatsApp" style={{ flex: 1 }} onPress={() => toast('Opens WhatsApp with a pre-written caption')} />
              <Pressable className="w-[42px] h-[42px] rounded-md bg-card border border-line items-center justify-center" onPress={() => toast('Deal link copied')}>
                <Icon name="Copy" size={18} color={colors.ink} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View className="bg-card border-t border-line px-4 pt-[11px] flex-row items-center gap-[10px]" style={{ paddingBottom: insets.bottom + 12 }}>
        {isActive && (
          <>
            <View className="shrink-0">
              <Text className="font-p-medium text-[9px] text-sub tracking-[0.4px]">WHOLESALE</Text>
              <Text className="font-m-extrabold text-[15.5px] text-green">{naira(deal.price)}<Text className="font-p-medium text-[9px] text-sub"> /{deal.unit}</Text></Text>
            </View>
            <Pressable className="w-[46px] h-[46px] rounded-md border-[1.5px] border-green items-center justify-center bg-limeTint" onPress={openSheet}>
              <Icon name="ShoppingCart" size={21} color={colors.green} />
            </Pressable>
            <FsButton size="lg" label="Buy Your Portion" style={{ flex: 1 }} onPress={openSheet} />
          </>
        )}
        {isUpcoming && (
          <>
            <View className="flex-1">
              <Text className="font-p-semibold text-[12.5px] text-ink">This deal opens soon</Text>
              <Text className="font-p-regular text-[11px] text-sub mt-[1px]">est. {naira(deal.price)} per {deal.unit}</Text>
            </View>
            <FsButton size="md" kind="outline" label="Remind Me" onPress={() => toast('You’ll be notified when this deal opens')} />
          </>
        )}
        {isClosed && (
          <View className="flex-1 flex-row items-center justify-center gap-[7px] py-2">
            <Icon name="Lock" size={15} color={colors.sub} />
            <Text className="font-p-medium text-[12.5px] text-sub">This deal has closed</Text>
          </View>
        )}
      </View>

      {/* Quantity sheet */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={`How many ${deal.unit}s?`}>
        <View className="flex-row items-center gap-3 bg-field rounded-md px-[13px] py-[11px]">
          <ProductImage productId={deal.product} style={{ width: 46, height: 46, borderRadius: 8 }} />
          <View className="flex-1">
            <Text className="font-p-semibold text-[12px] text-ink">{deal.short}</Text>
            <Text className="font-p-regular text-[11px] text-sub mt-[1px]">{naira(deal.price)} per {deal.unit} · wholesale</Text>
          </View>
        </View>

        <View className="items-center mt-5 mb-[6px]">
          <QtyControl value={qty} onChange={setQty} min={deal.min} max={maxQty} />
        </View>
        <Text className="font-p-regular text-[10.5px] text-sub text-center">Min {deal.min} · Max {deal.max} {deal.unit}s per farmer · starts at the minimum</Text>

        <View className="flex-row justify-between items-baseline mt-4 pt-3 border-t border-line border-dashed">
          <Text className="font-p-regular text-[12px] text-sub">{qty} {deal.unit}s × {naira(deal.price)}</Text>
          <Text className="font-m-extrabold text-[19px] text-ink">{naira(qty * deal.price)}</Text>
        </View>
        <Text className="font-p-semibold text-[11px] text-green mt-1">You save {naira(qty * (deal.retail - deal.price))} vs retail</Text>
        <Text className="font-p-regular text-[10px] text-faint mt-1 mb-[14px]">+ delivery & pickup options chosen at checkout · confirmed after the deal fills</Text>

        <FsButton full size="lg" label="Proceed to Checkout" onPress={() => { setSheetOpen(false); addDealToCart(deal.id, qty); navigation.navigate('Cart'); }} />
        <FsButton full kind="secondary" label="Add to Cart" style={{ marginTop: 9 }} onPress={() => { addDealToCart(deal.id, qty); setSheetOpen(false); }} />
        <Pressable className="self-center mt-3 py-1 px-3" onPress={() => setSheetOpen(false)}>
          <Text className="font-p-medium text-[12px] text-sub">Cancel</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
