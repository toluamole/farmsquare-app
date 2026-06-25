import React, { useState, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import FsButton from '../../components/common/FsButton';
import Icon, { IconName } from '../../components/common/Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Slides'>;

const slides: { icon: IconName; headline: string; body: string }[] = [
  { icon: 'Store', headline: 'Shop smarter', body: "Seeds, fertilizers and equipment from Nigeria's leading agro store — delivered to your gate." },
  { icon: 'Truck', headline: 'Buy cheaper together', body: 'Join truck-load Group Buy deals and pay wholesale prices — up to 25% below retail.' },
  { icon: 'Calendar', headline: 'Grow with guidance', body: 'A day-by-day calendar for your crop, plus expert help when something goes wrong.' },
];

export default function SlidesScreen({ navigation }: Props) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goNext = () => {
    if (current < slides.length - 1) {
      const next = current + 1;
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
      setCurrent(next);
    } else {
      navigation.replace('AuthGate');
    }
  };

  const skip = () => navigation.replace('AuthGate');

  return (
    <View className="flex-1 bg-bg">
      <Pressable onPress={skip} className="self-end p-[18px] pb-1">
        <Text className="font-p-medium text-[12.5px] text-sub">Skip</Text>
      </Pressable>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={e => setCurrent(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {slides.map((slide, i) => (
          <View key={i} className="flex-1 items-center justify-center px-[34px]" style={{ width: SCREEN_WIDTH }}>
            <View className="w-[220px] h-[200px] rounded-[30px] bg-limeTint items-center justify-center mb-7 border border-limeLine">
              <Icon name={slide.icon} size={84} color={colors.green} strokeWidth={1.5} />
            </View>
            <Text className="font-m-extrabold text-[24px] text-ink text-center mb-[10px]">{slide.headline}</Text>
            <Text className="font-p-regular text-[13px] text-sub text-center leading-5">{slide.body}</Text>
          </View>
        ))}
      </ScrollView>
      <View className="flex-row justify-center gap-[6px] pb-[18px]">
        {slides.map((_, i) => (
          <View key={i} className="h-[7px] rounded-full" style={{ width: i === current ? 22 : 7, backgroundColor: i === current ? colors.green : '#D5D8CC' }} />
        ))}
      </View>
      <View className="px-5 pb-6">
        <FsButton label={current === slides.length - 1 ? 'Get Started' : 'Next'} onPress={goNext} full size="lg" />
      </View>
    </View>
  );
}
