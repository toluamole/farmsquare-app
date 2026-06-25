import React, { useEffect, useRef } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../../theme';
import Icon from '../common/Icon';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: number;
}

export default function BottomSheet({ open, onClose, title, children, maxHeight = SCREEN_HEIGHT * 0.9 }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [open]);

  if (!open && !translateY) return null;

  return (
    <View style={styles.overlay} pointerEvents={open ? 'auto' : 'none'}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity }]} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[styles.sheet, { maxHeight, paddingBottom: insets.bottom + 16, transform: [{ translateY }] }]}
      >
        <View className="w-9 h-1 rounded-[2px] bg-line self-center mt-3 mb-1" />
        {title && (
          <View className="flex-row items-center justify-between px-5 py-3 border-b border-line">
            <Text className="font-m-bold text-[15px] text-ink">{title}</Text>
            <Pressable onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="X" size={20} color={colors.sub} />
            </Pressable>
          </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false} className="px-5 pt-4">
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
});
