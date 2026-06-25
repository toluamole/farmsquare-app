import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon, { IconName } from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import { useCreateOrderMutation } from '../../store/api/wooApi';
import { WCOrder } from '../../services/woocommerce';
import ScreenHeader from '../../components/layout/ScreenHeader';
import FsBadge from '../../components/common/FsBadge';
import FsButton from '../../components/common/FsButton';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

// Maps the UI payment choice to WooCommerce method ids + the order status the
// order should be created in.
const PAYMENT_MAP: Record<string, { method: string; title: string; status: string }> = {
  paystack: { method: 'paystack', title: 'Paystack — Card', status: 'pending' },
  transfer: { method: 'bacs', title: 'Bank Transfer', status: 'on-hold' },
  pod: { method: 'cod', title: 'Pay on Delivery', status: 'processing' },
};

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

const PAY_METHODS: { id: string; name: string; desc: string; icon: IconName }[] = [
  { id: 'paystack', name: 'Card — Paystack', desc: 'Pay securely with debit card, USSD or bank', icon: 'CreditCard' },
  { id: 'transfer', name: 'Bank Transfer', desc: 'Transfer to a dedicated virtual account', icon: 'ArrowLeftRight' },
  { id: 'pod', name: 'Pay on Delivery', desc: 'Pay cash or POS when your order arrives', icon: 'Banknote' },
];

export default function CheckoutStep2Screen({ navigation, route }: { navigation: any; route: any }) {
  const app = useApp();
  const insets = useSafeAreaInsets();
  const params = route.params || {};
  const [createOrder] = useCreateOrderMutation();

  const [pay, setPay] = useState('paystack');
  const [placing, setPlacing] = useState(false);

  const items = app.cartItems;
  const subtotal = items.reduce((s, it) => s + it.p.price * it.qty, 0);
  const hasGb = items.some(it => it.gb);
  const hasNonGb = items.some(it => !it.gb);
  const fee: number = hasNonGb ? (params.shipFee || 0) : 0;
  const gbPickup = params.gbShip === 'pickup';
  const total = subtotal + fee;

  const customerEmail = app.auth.email || 'orders@farmsquare.ng';

  // Build the WooCommerce order payload from cart + selected delivery details.
  // Group-buy items use local-only product ids that don't exist in WC, so they
  // are excluded from line_items (they remain in the local order for the user).
  const buildWcOrder = (): { order: WCOrder; lineCount: number } => {
    const addr = app.addresses[params.addr] ?? app.addresses[0];
    const fullName = addr?.name || app.auth.name || 'Farmsquare Customer';
    const [firstName, ...rest] = fullName.split(' ');
    const lastName = rest.join(' ') || '-';
    const state = app.profile.state || '';

    const billing = {
      first_name: firstName,
      last_name: lastName,
      address_1: addr?.street || '',
      city: addr?.city || '',
      state,
      country: 'NG',
      phone: addr?.phone || app.auth.phone || '',
      email: customerEmail,
    };
    const shipping = {
      first_name: firstName,
      last_name: lastName,
      address_1: addr?.street || '',
      city: addr?.city || '',
      state,
      country: 'NG',
    };

    const line_items = items
      .filter(it => !it.gb)
      .map(it => ({ product_id: Number(it.p.id), quantity: it.qty }))
      .filter(li => Number.isFinite(li.product_id) && li.product_id > 0);

    const shipping_lines =
      hasNonGb && params.shipName
        ? [{ method_id: params.ship || 'flat_rate', method_title: params.shipName, total: String(fee) }]
        : undefined;

    const map = PAYMENT_MAP[pay];
    const order: WCOrder = {
      status: map.status,
      billing,
      shipping,
      line_items,
      shipping_lines,
      payment_method: map.method,
      payment_method_title: map.title,
    };
    return { order, lineCount: line_items.length };
  };

  // Records the order locally (real WC id when available) and shows success.
  const finalize = (orderId?: string) => {
    const order = app.placeOrder({
      total,
      fee,
      ship: params.shipName || params.gbShip || undefined,
      id: orderId,
    });
    navigation.replace('OrderSuccess', { id: order.id });
  };

  const place = async () => {
    if (placing) return;
    setPlacing(true);

    // 1. Create the WooCommerce order (only when there are real WC line items).
    let wcOrderId: string | undefined;
    try {
      const { order, lineCount } = buildWcOrder();
      if (lineCount > 0) {
        const created = await createOrder(order).unwrap();
        wcOrderId = created.id;
      }
    } catch {
      setPlacing(false);
      app.toast('Could not place your order. Please try again.');
      return;
    }

    // 2. Take payment. Paystack is temporarily removed; all methods create the
    // order as-is (card payments will be re-enabled when Paystack is restored).
    finalize(wcOrderId);
  };

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader title="Payment" />
      <CheckoutSteps step={2} />

      <ScrollView className="flex-1" contentContainerClassName="px-4" showsVerticalScrollIndicator={false}>
        {/* Order summary */}
        <View className="bg-card border border-line rounded-md px-[13px] py-1 mt-[2px]">
          {items.map(it => (
            <View key={it.key} className="flex-row justify-between gap-[10px] py-[9px] border-b border-line">
              <View className="flex-1">
                {it.gb && (
                  <View className="flex-row mb-[3px]">
                    <FsBadge tone="solid">GROUP BUY</FsBadge>
                  </View>
                )}
                <Text className="font-p-regular text-[11.5px] text-ink leading-4">{it.p.name} <Text className="text-sub">×{it.qty}</Text></Text>
              </View>
              <Text className="font-p-semibold text-[11.5px] text-ink">{naira(it.p.price * it.qty)}</Text>
            </View>
          ))}

          {hasNonGb && (
            <View className="flex-row justify-between gap-[10px] py-[9px] border-b border-line">
              <Text className="flex-1 font-p-regular text-[11.5px] text-sub">{params.shipName || 'Delivery'}</Text>
              <Text className={cn('font-p-medium text-[11.5px]', fee === 0 ? 'text-green' : 'text-ink')}>{fee === 0 ? 'FREE' : naira(fee)}</Text>
            </View>
          )}
          {hasGb && (
            <View className="flex-row justify-between gap-[10px] py-[9px] border-b border-line">
              <Text className="flex-1 font-p-regular text-[11.5px] text-sub">Group Buy delivery — {gbPickup ? 'Office Pickup' : 'Bulk Cargo'}</Text>
              <Text className={cn('font-p-medium', gbPickup ? 'text-green text-[11.5px]' : 'text-amberInk text-[10.5px]')}>{gbPickup ? 'FREE' : 'Confirmed after deal fills'}</Text>
            </View>
          )}

          <View className="flex-row justify-between items-baseline py-[10px]">
            <Text className="font-p-semibold text-[12.5px] text-ink">Total</Text>
            <Text className="font-m-extrabold text-[18px] text-green">{naira(total)}</Text>
          </View>
        </View>

        {/* Payment methods */}
        <Text className="font-p-semibold text-[11.5px] text-sub mt-4 mb-[9px] tracking-[0.3px]">PAYMENT METHOD</Text>
        {PAY_METHODS.map(m => {
          const sel = pay === m.id;
          return (
            <Pressable key={m.id} className={cn('flex-row items-center gap-[11px] bg-card border-[1.5px] rounded-md px-[13px] py-3 mb-2', sel ? 'bg-limeTint border-green' : 'border-line')} onPress={() => setPay(m.id)}>
              <View className={cn('w-[18px] h-[18px] rounded-full border-2 items-center justify-center shrink-0', sel ? 'border-green' : 'border-faint')}>
                {sel && <View className="w-2 h-2 rounded-full bg-green" />}
              </View>
              <View className="flex-1">
                <Text className="font-p-semibold text-[12.5px] text-ink">{m.name}</Text>
                <Text className="font-p-regular text-[11px] text-sub">{m.desc}</Text>
              </View>
              <Icon name={m.icon} size={18} color={colors.sub} />
            </Pressable>
          );
        })}

        <View className="flex-row items-center gap-[7px] mt-1">
          <Icon name="CircleCheck" size={14} color={colors.green} />
          <Text className="font-p-regular text-[10.5px] text-sub">Secured payment — PCI-DSS compliant</Text>
        </View>

        {hasGb && (
          <View className="flex-row gap-2 items-start bg-limeTint border border-limeLine rounded-sm px-3 py-[10px] mt-[10px]">
            <Icon name="ShieldCheck" size={16} color={colors.green} style={{ flexShrink: 0, marginTop: 1 }} />
            <Text className="flex-1 font-p-regular text-[10px] text-sub leading-[15px]">
              <Text className="font-p-semibold text-ink">Protected by escrow. </Text>
              Your Group Buy payment is held safely until the deal closes — if the truck-load doesn't fill, you're refunded in full within 3–5 working days. We'll reach out with your confirmed delivery date and any final shipping fee once the deal fills.
            </Text>
          </View>
        )}

        <View style={{ height: 12 }} />
      </ScrollView>

      <View className="bg-card border-t border-line px-4 pt-[10px]" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <FsButton full size="lg" loading={placing} label={placing ? 'Processing payment…' : `Place Order & Pay ${naira(total)}`} onPress={place} />
        <Text className="font-p-regular text-[9.5px] text-faint text-center mt-2">By placing your order you agree to Farmsquare's Terms of Service</Text>
      </View>
    </View>
  );
}
