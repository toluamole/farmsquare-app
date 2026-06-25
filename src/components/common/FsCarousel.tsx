import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Dimensions, Pressable } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FsCarouselProps {
  slides: React.ReactNode[];
  height: number;
  interval?: number;
  autoPlay?: boolean;
}

export default function FsCarousel({ slides, height, interval = 3500, autoPlay = true }: FsCarouselProps) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = () => {
    if (!autoPlay) return;
    timerRef.current = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % slides.length;
        scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
        return next;
      });
    }, interval);
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [slides.length]);

  const onScroll = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    setActive(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
  };

  return (
    <View style={{ height }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={stopAutoPlay}
        onScrollEndDrag={startAutoPlay}
        style={{ flex: 1 }}
      >
        {slides.map((slide, i) => (
          <View key={i} style={{ width: SCREEN_WIDTH, height }}>
            {slide}
          </View>
        ))}
      </ScrollView>
      <View className="absolute bottom-[10px] left-0 right-0 flex-row justify-center items-center gap-[5px]">
        {slides.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => {
              scrollRef.current?.scrollTo({ x: i * SCREEN_WIDTH, animated: true });
              setActive(i);
            }}
            className="h-[7px] rounded-full"
            style={{ width: i === active ? 22 : 7, backgroundColor: i === active ? '#fff' : 'rgba(255,255,255,.5)' }}
          />
        ))}
      </View>
    </View>
  );
}
