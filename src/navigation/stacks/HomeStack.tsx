import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';
import HomeScreen from '../../screens/home/HomeScreen';
import NotificationsScreen from '../../screens/home/NotificationsScreen';
import SearchScreen from '../../screens/home/SearchScreen';
import ListingScreen from '../../screens/shop/ListingScreen';
import ProductScreen from '../../screens/shop/ProductScreen';
import CartScreen from '../../screens/shop/CartScreen';
import CheckoutStep1Screen from '../../screens/shop/CheckoutStep1Screen';
import CheckoutStep2Screen from '../../screens/shop/CheckoutStep2Screen';
import OrderSuccessScreen from '../../screens/shop/OrderSuccessScreen';
import OrderTrackingScreen from '../../screens/shop/OrderTrackingScreen';
import DealDetailScreen from '../../screens/groupbuy/DealDetailScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Listing" component={ListingScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout1" component={CheckoutStep1Screen} />
      <Stack.Screen name="Checkout2" component={CheckoutStep2Screen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="DealDetail" component={DealDetailScreen} />
    </Stack.Navigator>
  );
}
