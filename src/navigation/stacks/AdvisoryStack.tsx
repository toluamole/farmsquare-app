import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdvisoryStackParamList } from '../types';
import MyFarmScreen from '../../screens/advisory/MyFarmScreen';
import JourneyScreen from '../../screens/advisory/JourneyScreen';
import ActivityScreen from '../../screens/advisory/ActivityScreen';
import ProblemHomeScreen from '../../screens/problem/ProblemHomeScreen';
import ProblemStep1Screen from '../../screens/problem/ProblemStep1Screen';
import ProblemStep2Screen from '../../screens/problem/ProblemStep2Screen';
import AnalyzingScreen from '../../screens/problem/AnalyzingScreen';
import ResultsScreen from '../../screens/problem/ResultsScreen';
import ProductScreen from '../../screens/shop/ProductScreen';

const Stack = createNativeStackNavigator<AdvisoryStackParamList>();

export default function AdvisoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MyFarm" component={MyFarmScreen} />
      <Stack.Screen name="Journey" component={JourneyScreen} />
      <Stack.Screen name="Activity" component={ActivityScreen} />
      <Stack.Screen name="ProblemHome" component={ProblemHomeScreen} />
      <Stack.Screen name="ProblemStep1" component={ProblemStep1Screen} />
      <Stack.Screen name="ProblemStep2" component={ProblemStep2Screen} />
      <Stack.Screen name="Analyzing" component={AnalyzingScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
    </Stack.Navigator>
  );
}
