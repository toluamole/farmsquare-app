import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import { cn } from '../../lib/utils';
import { getNotifications, AppNotification } from '../../services/notifications';
import FsChip from '../../components/common/FsChip';
import FsEmpty from '../../components/common/FsEmpty';
import Icon, { IconName } from '../../components/common/Icon';

const TONE_ICON: Record<string, IconName> = {
  amber: 'Zap',
  green: 'Leaf',
  blue: 'BadgeDollarSign',
  red: 'TriangleAlert',
};

const TONE_COLOR: Record<string, string> = {
  amber: colors.amberInk,
  green: colors.green,
  blue: '#2D6CDF',
  red: colors.red,
};

const FILTER_OPTS = ['All', 'Deals', 'Farm', 'Orders'];

export default function NotificationsScreen({ navigation }: { navigation: any }) {
  const [filter, setFilter] = useState('All');
  const [read, setRead] = useState<Set<number>>(new Set());
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getNotifications()
      .then(n => { if (active) setNotifs(n); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const markAllRead = () => setRead(new Set(notifs.map((_, i) => i)));

  const filtered = notifs.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Deals') return n.tone === 'amber' || n.tone === 'blue';
    if (filter === 'Farm') return n.tone === 'green' && n.icon === 'leaf';
    if (filter === 'Orders') return n.icon === 'cart';
    return true;
  });

  const groups = ['Today', 'Yesterday'];

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-line bg-bg">
        <Pressable onPress={() => navigation.goBack()} className="w-9 h-9 items-center justify-center" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="ArrowLeft" size={24} color={colors.ink} />
        </Pressable>
        <Text className="flex-1 font-m-bold text-[16px] text-ink text-center">Notifications</Text>
        <Pressable onPress={markAllRead} className="px-1">
          <Text className="font-p-medium text-[11.5px] text-green">Mark all read</Text>
        </Pressable>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 py-[10px] gap-2"
        className="max-h-[52px]"
      >
        {FILTER_OPTS.map(opt => (
          <FsChip key={opt} label={opt} active={filter === opt} onPress={() => setFilter(opt)} small />
        ))}
      </ScrollView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.green} />
        </View>
      ) : notifs.length === 0 ? (
        <FsEmpty
          icon="box"
          title="No notifications yet"
          sub="Deal alerts, order updates and farm reminders will show up here."
        />
      ) : (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {groups.map(group => {
          const items = filtered.filter(n => n.group === group);
          if (items.length === 0) return null;
          return (
            <View key={group}>
              <Text className="font-p-semibold text-[11px] text-faint tracking-[0.5px] uppercase px-4 pt-4 pb-[6px]">{group}</Text>
              {items.map((n, idx) => {
                const globalIdx = notifs.indexOf(n);
                const isRead = read.has(globalIdx) || !n.unread;
                return (
                  <Pressable
                    key={idx}
                    className={cn('flex-row items-start px-4 py-[14px] border-b border-line gap-3', isRead ? 'bg-bg' : 'bg-card')}
                    onPress={() => setRead(prev => new Set([...prev, globalIdx]))}
                  >
                    <View
                      className="w-11 h-11 rounded-full items-center justify-center shrink-0"
                      style={{ backgroundColor: n.tone === 'green' ? colors.limeTint : n.tone === 'amber' ? colors.amberTint : '#E7EEF8' }}
                    >
                      <Icon name={TONE_ICON[n.tone] || 'Bell'} size={20} color={TONE_COLOR[n.tone] || colors.sub} />
                    </View>
                    <View className="flex-1">
                      <Text className={cn('text-[13px] mb-[2px]', isRead ? 'font-p-medium text-sub' : 'font-p-semibold text-ink')}>{n.title}</Text>
                      <Text className="font-p-regular text-[12px] text-sub leading-[17px] mb-1" numberOfLines={2}>{n.body}</Text>
                      <Text className="font-p-regular text-[10.5px] text-faint">{n.time}</Text>
                    </View>
                    {!isRead && <View className="w-2 h-2 rounded-[4px] bg-green mt-[5px] shrink-0" />}
                  </Pressable>
                );
              })}
            </View>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
      )}
    </SafeAreaView>
  );
}
