import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountStackParamList } from '../types';
import AccountScreen from '../../screens/account/AccountScreen';
import AddressesScreen from '../../screens/account/AddressesScreen';
import PaymentsScreen from '../../screens/account/PaymentsScreen';
import EditProfileScreen from '../../screens/account/EditProfileScreen';
import NotifPrefsScreen from '../../screens/account/NotifPrefsScreen';
import ReferralScreen from '../../screens/account/ReferralScreen';
import SupportScreen from '../../screens/account/SupportScreen';
import MyOrdersScreen from '../../screens/shop/MyOrdersScreen';
import OrderTrackingScreen from '../../screens/shop/OrderTrackingScreen';
import GbOrderScreen from '../../screens/groupbuy/GbOrderScreen';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export default function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="NotifPrefs" component={NotifPrefsScreen} />
      <Stack.Screen name="Referral" component={ReferralScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="GbOrder" component={GbOrderScreen} />
    </Stack.Navigator>
  );
}
