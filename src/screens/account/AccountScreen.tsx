import React from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon, { IconName } from '../../components/common/Icon';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import FsButton from '../../components/common/FsButton';
import { useAppDispatch } from '../../store/hooks';
import { setEmailVerified } from '../../store/slices/authSlice';
import { sendVerificationEmail, reloadEmailVerified } from '../../services/firebase';

function MenuRow({ icon, title, sub, onPress }: { icon: IconName; title: string; sub?: string; onPress: () => void }) {
  return (
    <Pressable className="flex-row items-center gap-3 px-[14px] py-[13px] border-b border-line" onPress={onPress}>
      <View className="w-[38px] h-[38px] rounded-full bg-limeTint items-center justify-center">
        <Icon name={icon} size={18} color={colors.green} />
      </View>
      <View className="flex-1">
        <Text className="font-p-semibold text-[12.5px] text-ink">{title}</Text>
        {sub ? <Text className="font-p-regular text-[10.5px] text-sub mt-[1px]">{sub}</Text> : null}
      </View>
      <Icon name="ChevronRight" size={17} color={colors.faint} />
    </Pressable>
  );
}

export default function AccountScreen({ navigation }: { navigation: any; route: any }) {
  const app = useApp();
  const { auth, orders, reservations, addresses, payments, signOut, toast } = app;
  const dispatch = useAppDispatch();

  const signedIn = auth.signedIn;
  const name = auth.name || 'Farmer';
  // No dummy fallback: show the real phone if set, else the account email.
  const phone = auth.phone || auth.email || '';
  const initial = (name.trim()[0] || 'A').toUpperCase();

  const handleLogout = () => {
    signOut();
    toast('Signed out');
  };

  // Re-check first (they may have tapped the link since the last app start),
  // only resending if still unverified.
  const handleVerifyEmail = async () => {
    if (await reloadEmailVerified()) {
      dispatch(setEmailVerified(true));
      toast('Email verified 🎉');
      return;
    }
    const res = await sendVerificationEmail();
    toast(res.success ? 'Verification link sent. Check your inbox.' : res.error || 'Could not send the email.');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle={signedIn ? 'light-content' : 'dark-content'} backgroundColor={signedIn ? colors.green : colors.bg} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {signedIn ? (
          <>
            {/* Green header band */}
            <View className="bg-green flex-row items-center gap-[14px] px-4 pt-[18px] pb-10">
              <View className="w-[58px] h-[58px] rounded-full bg-lime items-center justify-center">
                <Text className="font-m-bold text-[24px] text-[#0A3D0C]">{initial}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-m-bold text-[17px] text-white">{name}</Text>
                <Text className="font-p-regular text-[12px] text-[rgba(255,255,255,0.82)] mt-[2px]">{phone}</Text>
              </View>
              <Pressable className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.16)] items-center justify-center" onPress={() => navigation.navigate('EditProfile')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="Pencil" size={16} color="#fff" />
              </Pressable>
            </View>

            {/* Stats row */}
            <View className="flex-row bg-card rounded-md border border-line mx-4 -mt-[26px] mb-4 py-[14px]" style={{ shadowColor: '#1C2118', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
              <Pressable className="flex-1 items-center" onPress={() => navigation.navigate('MyOrders')}>
                <Text className="font-m-bold text-[16px] text-green">{orders.length}</Text>
                <Text className="font-p-regular text-[10.5px] text-sub mt-[2px]">Orders</Text>
              </Pressable>
              <View className="w-px bg-line" />
              <Pressable className="flex-1 items-center" onPress={() => navigation.getParent()?.navigate('GroupBuyTab', { screen: 'GroupBuy' })}>
                <Text className="font-m-bold text-[16px] text-green">{reservations.length}</Text>
                <Text className="font-p-regular text-[10.5px] text-sub mt-[2px]">Group Buys</Text>
              </Pressable>
              <View className="w-px bg-line" />
              <View className="flex-1 items-center">
                <Text className="font-m-bold text-[16px] text-green">₦12,400</Text>
                <Text className="font-p-regular text-[10.5px] text-sub mt-[2px]">Saved</Text>
              </View>
            </View>
          </>
        ) : (
          /* Guest CTA card */
          <View className="bg-card rounded-md border border-line m-4 p-[22px] items-center">
            <View className="w-[56px] h-[56px] rounded-full bg-limeTint items-center justify-center mb-3">
              <Icon name="User" size={26} color={colors.green} />
            </View>
            <Text className="font-m-bold text-[16px] text-ink mb-[6px]">Sign in to Farmsquare</Text>
            <Text className="font-p-regular text-[12px] text-sub text-center leading-[18px] mb-4">Track orders, join Group Buy deals and get farm reminders made for Nigerian farmers.</Text>
            <FsButton label="Sign in or create account" full size="lg" onPress={() => navigation.getParent()?.navigate('AuthGate')} />
          </View>
        )}

        {/* Verify-email reminder (soft gate, A-4d) — hidden once verified */}
        {signedIn && auth.emailVerified === false && (
          <Pressable
            className="flex-row items-center gap-3 bg-card rounded-md border border-[#EFDDB9] mx-4 mb-4 px-[14px] py-[13px]"
            onPress={handleVerifyEmail}
          >
            <View className="w-[38px] h-[38px] rounded-full bg-[#FBF3DF] items-center justify-center">
              <Icon name="Mail" size={18} color="#B7791F" />
            </View>
            <View className="flex-1">
              <Text className="font-p-semibold text-[12.5px] text-ink">Verify your email</Text>
              <Text className="font-p-regular text-[10.5px] text-sub mt-[1px]">Tap to resend the verification link</Text>
            </View>
            <Icon name="ChevronRight" size={17} color={colors.faint} />
          </Pressable>
        )}

        {/* Menu list */}
        <View className="bg-card rounded-md border border-line mx-4 overflow-hidden">
          <MenuRow icon="Package" title="My Orders" sub="Track and reorder" onPress={() => navigation.navigate('MyOrders')} />
          <MenuRow icon="MapPin" title="Saved Addresses" sub={`${addresses.length} saved`} onPress={() => navigation.navigate('Addresses')} />
          <MenuRow icon="CreditCard" title="Payment Methods" sub={payments.length ? `${payments[0].bank || payments[0].brand} •••• ${payments[0].last4}` : 'Add a card'} onPress={() => navigation.navigate('Payments')} />
          <MenuRow icon="Bell" title="Notification Preferences" sub="Push, SMS & WhatsApp" onPress={() => navigation.navigate('NotifPrefs')} />
          <MenuRow icon="Gift" title="Referral Programme" sub="Give ₦1,000, get ₦1,000" onPress={() => navigation.navigate('Referral')} />
          <MenuRow icon="LifeBuoy" title="Help & Support" sub="WhatsApp · 9am–6pm" onPress={() => navigation.navigate('Support')} />
        </View>

        {/* Logout */}
        {signedIn && (
          <Pressable className="flex-row items-center justify-center gap-2 mx-4 mt-4 border-[1.5px] border-[#F2D5D0] rounded-md py-3 bg-card" onPress={handleLogout}>
            <Icon name="LogOut" size={18} color={colors.red} />
            <Text className="font-p-semibold text-[12.5px] text-red">Log Out</Text>
          </Pressable>
        )}

        <Text className="font-p-regular text-[10px] text-faint text-center mt-[14px]">Farmsquare v1.1 · Terms · Privacy</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
