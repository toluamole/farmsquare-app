import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import {
  fsResolveZone, fsGetShippingMethods, fsCalculateShipping,
  FS_PRODUCT_CLASSES, ShippingMethod, CartItemForShipping,
} from '../../services/shipping';
import ScreenHeader from '../../components/layout/ScreenHeader';
import FsButton from '../../components/common/FsButton';
import FsEmpty from '../../components/common/FsEmpty';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

function CheckoutSteps({ step }: { step: number }) {
  return (
    <View className="flex-row items-center gap-2 px-4 pt-2 pb-3">
      {['Delivery', 'Payment'].map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <View className={cn('flex-1 h-[2px] rounded-[2px]', step > 1 ? 'bg-green' : 'bg-line')} />}
          <View className="flex-row items-center gap-[6px]">
            <View className={cn('w-5 h-5 rounded-full items-center justify-center', step > i ? 'bg-green' : 'bg-line')}>
              <Text className={cn('font-m-bold text-[10.5px] leading-[14px]', step > i ? 'text-white' : 'text-sub')}>{i + 1}</Text>
            </View>
            <Text className={cn('text-[11px]', step > i ? 'text-ink' : 'text-sub', step === i + 1 ? 'font-p-semibold' : 'font-p-regular')}>{l}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <View className={cn('w-[18px] h-[18px] rounded-full border-2 items-center justify-center shrink-0 mt-[1px]', selected ? 'border-green' : 'border-faint')}>
      {selected && <View className="w-2 h-2 rounded-full bg-green" />}
    </View>
  );
}

const GB_METHODS = [
  { id: 'cargo', name: 'Bulk Cargo Delivery', desc: 'Truck-load freight to your address' },
  { id: 'pickup', name: 'Office Pickup', desc: 'Collect from Farmsquare, Ibadan — free' },
];

const optionCard = (selected: boolean) =>
  cn('flex-row items-start gap-[11px] bg-card border-[1.5px] rounded-md px-[13px] py-3 mb-2', selected ? 'bg-limeTint border-green' : 'border-line');

export default function CheckoutStep1Screen({ navigation }: { navigation: any; route: any }) {
  const app = useApp();
  const insets = useSafeAreaInsets();
  const { addresses, cartItems, profile } = app;

  const [addr, setAddr] = useState(0);
  const [ship, setShip] = useState<string | null>(null);
  const [gbShip, setGbShip] = useState('cargo');

  const hasGb = cartItems.some(it => it.gb);
  const hasNonGb = cartItems.some(it => !it.gb);
  const gbDeal = cartItems.find(it => it.gb)?.deal;

  const zone = fsResolveZone(profile.state || '');

  const { sorted, costs, cheapestPaid } = useMemo(() => {
    const allMethods: ShippingMethod[] = zone ? fsGetShippingMethods(zone) : [];
    const nonGbItems: CartItemForShipping[] = cartItems
      .filter(it => !it.gb)
      .map(it => ({ id: it.p.id, qty: it.qty, price: it.p.price, classId: FS_PRODUCT_CLASSES[it.p.id] }));

    const costMap: Record<string, number | null> = {};
    allMethods.forEach(m => {
      if (m.id === 'pickup') { costMap[m.id] = 0; return; }
      const r = zone ? fsCalculateShipping(nonGbItems, zone, m.id) : { success: false as const };
      costMap[m.id] = r.success && r.cost != null ? r.cost : null;
    });

    const available = allMethods
      .filter(m => m.id === 'pickup' || (costMap[m.id] != null && (costMap[m.id] as number) > 0))
      .sort((a, b) => (costMap[a.id] ?? 9e9) - (costMap[b.id] ?? 9e9));

    return {
      sorted: available,
      costs: costMap,
      cheapestPaid: available.find(m => (costMap[m.id] ?? 0) > 0) || null,
    };
  }, [zone, cartItems]);

  useEffect(() => {
    if (hasNonGb && !ship && sorted.length > 0) setShip(sorted[0].id);
  }, [hasNonGb, ship, sorted]);

  if (cartItems.length === 0) {
    return (
      <View className="flex-1 bg-bg">
        <ScreenHeader title="Delivery Details" />
        <FsEmpty icon="cart" title="Your cart is empty" sub="Add some products before checking out." action="Start Shopping" onAction={() => navigation.goBack()} />
      </View>
    );
  }

  const shipMethod = sorted.find(m => m.id === ship) || null;

  const continueToPayment = () => {
    navigation.navigate('Checkout2', {
      ship: hasNonGb ? ship : null,
      shipFee: hasNonGb && ship != null ? (costs[ship] ?? 0) : 0,
      shipName: hasNonGb && shipMethod ? shipMethod.name : null,
      gbShip: hasGb ? gbShip : null,
      addr,
    });
  };

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader title="Delivery Details" />
      <CheckoutSteps step={1} />

      <ScrollView className="flex-1" contentContainerClassName="px-4" showsVerticalScrollIndicator={false}>
        {/* Address */}
        <Text className="font-p-semibold text-[11.5px] text-sub mt-[14px] mb-[9px] tracking-[0.3px]">DELIVERY ADDRESS</Text>
        {addresses.length > 1 ? (
          addresses.map((a, i) => (
            <Pressable key={`${a.name}-${i}`} className={optionCard(addr === i)} onPress={() => setAddr(i)}>
              <Radio selected={addr === i} />
              <View className="flex-1">
                <Text className="font-p-semibold text-[12.5px] text-ink">{a.name} <Text className="font-p-regular text-sub">· {a.phone}</Text></Text>
                <Text className="font-p-regular text-[11.5px] text-sub leading-[17px] mt-[2px]">{a.street}, {a.city}</Text>
              </View>
            </Pressable>
          ))
        ) : addresses[0] ? (
          <View className={optionCard(true)}>
            <Icon name="MapPin" size={18} color={colors.green} style={{ marginTop: 1 }} />
            <View className="flex-1">
              <Text className="font-p-semibold text-[12.5px] text-ink">{addresses[0].name} <Text className="font-p-regular text-sub">· {addresses[0].phone}</Text></Text>
              <Text className="font-p-regular text-[11.5px] text-sub leading-[17px] mt-[2px]">{addresses[0].street}, {addresses[0].city}</Text>
            </View>
          </View>
        ) : null}

        {/* Group Buy delivery */}
        {hasGb && (
          <>
            <Text className="font-p-semibold text-[11.5px] text-sub mt-[14px] mb-[9px] tracking-[0.3px]">GROUP BUY DELIVERY</Text>
            {GB_METHODS.map(m => {
              const sel = gbShip === m.id;
              return (
                <Pressable key={m.id} className={optionCard(sel)} onPress={() => setGbShip(m.id)}>
                  <Radio selected={sel} />
                  <View className="flex-1">
                    <Text className="font-p-semibold text-[12.5px] text-ink">{m.name}</Text>
                    <Text className="font-p-regular text-[11px] text-sub mt-[2px]">{m.desc}</Text>
                  </View>
                  <Text className={cn('font-m-bold shrink-0 text-right', m.id === 'pickup' ? 'text-green text-[12.5px]' : 'text-amberInk text-[11px]')}>{m.id === 'pickup' ? 'FREE' : 'Confirmed later'}</Text>
                </Pressable>
              );
            })}

            {/* Predicted delivery + reach-out notice */}
            <View className="bg-card border border-green/30 rounded-md overflow-hidden mt-[1px] mb-[9px]">
              <View className="flex-row gap-[11px] items-start px-[13px] py-3">
                <Icon name="Bus" size={20} color={colors.green} style={{ flexShrink: 0, marginTop: 1 }} />
                <Text className="flex-1 font-p-regular text-[11.5px] text-ink leading-[17px]">
                  <Text className="font-p-semibold">Predicted delivery: {gbDeal ? gbDeal.deliveryWindow : '7–10 days after the deal closes'}</Text>
                  {'\n'}
                  <Text className="text-sub">{gbShip === 'pickup' ? 'Ready to collect once the deal fills.' : 'Dispatched once the truck-load fills.'}</Text>
                </Text>
              </View>
              <View className="flex-row gap-[9px] items-start bg-amberTint border-t border-line px-[13px] py-[10px]">
                <Icon name="Bell" size={15} color={colors.amberInk} style={{ flexShrink: 0, marginTop: 1 }} />
                <Text className="flex-1 font-p-regular text-[10.5px] text-amberInk leading-4">{gbShip === 'pickup' ? "We'll notify you the moment your share is ready to collect at our Ibadan office." : "We'll reach out with your confirmed delivery date and final freight fee as soon as the order is filled and shipping is available."}</Text>
              </View>
            </View>

            {/* Escrow */}
            <View className="flex-row gap-[10px] items-start bg-limeTint border border-limeLine rounded-md px-[13px] py-[11px]">
              <Icon name="ShieldCheck" size={18} color={colors.green} style={{ flexShrink: 0, marginTop: 1 }} />
              <Text className="flex-1 font-p-regular text-[10.5px] text-sub leading-4">
                <Text className="font-p-semibold text-ink">Protected by escrow. </Text>
                Your payment is held safely until the deal closes — if the truck-load doesn't fill, you're refunded in full within 3–5 working days.
              </Text>
            </View>
          </>
        )}

        {/* Regular shipping */}
        {hasNonGb && (
          <>
            <Text className="font-p-semibold text-[11.5px] text-sub mt-[14px] mb-[9px] tracking-[0.3px]">{hasGb ? 'SHIPPING FOR OTHER ITEMS' : 'DELIVERY METHOD'}</Text>
            {!zone && (
              <View className="bg-amberTint rounded-sm px-[11px] py-[9px] mb-2">
                <Text className="font-p-regular text-[11px] text-amberInk leading-4">We don't recognise a delivery zone for your state yet — update your profile state to see live rates.</Text>
              </View>
            )}
            {sorted.map(m => {
              const cost = costs[m.id] ?? 0;
              const sel = ship === m.id;
              const isCheapest = cheapestPaid != null && m.id === cheapestPaid.id;
              return (
                <Pressable key={m.id} className={optionCard(sel)} onPress={() => setShip(m.id)}>
                  <Radio selected={sel} />
                  <View className="flex-1">
                    <View className="flex-row items-center gap-[6px]">
                      <Text className="font-p-semibold text-[12.5px] text-ink">{m.name}</Text>
                      {isCheapest && (
                        <View className="bg-green rounded-full px-[7px] py-[2px]">
                          <Text className="font-p-bold text-[8.5px] text-white tracking-[0.3px] leading-[11px]">CHEAPEST</Text>
                        </View>
                      )}
                    </View>
                    <Text className="font-p-regular text-[11px] text-sub mt-[2px]">{m.desc}</Text>
                  </View>
                  <Text className={cn('font-m-bold text-[12.5px] shrink-0 text-right', cost === 0 ? 'text-green' : 'text-ink')}>{cost === 0 ? 'FREE' : naira(cost)}</Text>
                </Pressable>
              );
            })}
          </>
        )}

        <View style={{ height: 10 }} />
      </ScrollView>

      <View className="bg-card border-t border-line px-4 pt-[10px]" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <FsButton full size="lg" label="Continue to Payment" disabled={hasNonGb && !ship} onPress={continueToPayment} />
      </View>
    </View>
  );
}
