import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types';
import { colors } from '../theme';
import Icon, { IconName } from '../components/common/Icon';
import HomeStack from './stacks/HomeStack';
import ShopStack from './stacks/ShopStack';
import GroupBuyStack from './stacks/GroupBuyStack';
import AdvisoryStack from './stacks/AdvisoryStack';
import AccountStack from './stacks/AccountStack';

const Tab = createBottomTabNavigator<TabParamList>();

// lucide has no filled/outline pairs — one icon per tab; active state is shown
// via a subtle fill tint + heavier stroke (see tabBarIcon below).
const TAB_ICONS: Record<keyof TabParamList, IconName> = {
  HomeTab: 'House',
  ShopTab: 'Store',
  GroupBuyTab: 'Users',
  AdvisoryTab: 'Leaf',
  AccountTab: 'User',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: '#9AA191',
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.line,
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontFamily: 'Poppins_500Medium', fontSize: 10 },
        tabBarIcon: ({ focused, color }) => {
          const name = TAB_ICONS[route.name as keyof TabParamList];
          return (
            <View>
              <Icon
                name={name}
                size={22}
                color={color}
                strokeWidth={focused ? 2.4 : 2}
                fill={focused ? 'rgba(4,99,7,0.12)' : 'none'}
              />
              {route.name === 'GroupBuyTab' && <View style={styles.dot} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="ShopTab" component={ShopStack} options={{ title: 'Shop' }} />
      <Tab.Screen name="GroupBuyTab" component={GroupBuyStack} options={{ title: 'Group Buy' }} />
      <Tab.Screen name="AdvisoryTab" component={AdvisoryStack} options={{ title: 'Advisory' }} />
      <Tab.Screen name="AccountTab" component={AccountStack} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    top: -2,
    right: -5,
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: colors.amber,
  },
});
