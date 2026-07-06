import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { cropLabel, StageWithStatus } from '../../data/crops';
import { fsProduct } from '../../data/products';
import FsButton from '../../components/common/FsButton';
import FsBadge from '../../components/common/FsBadge';
import FsEmpty from '../../components/common/FsEmpty';
import FsProgress from '../../components/common/FsProgress';
import ScreenHeader from '../../components/layout/ScreenHeader';
import BottomSheet from '../../components/layout/BottomSheet';
import { STAGE_IMAGES } from './stageImages';

const DAY_MS = 86400000;
const naira = (n: number) => '₦' + n.toLocaleString('en-NG');
const fmtDate = (d: Date) => d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
const fmtDateFull = (d: Date) => d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
const toISO = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export default function JourneyScreen({ navigation, route }: { navigation: any; route: any }) {
  const { cropId, plantingDate } = route.params as { cropId: string; plantingDate: string };
  const { addToCart } = useApp();

  const [openId, setOpenId] = useState<string | null>(null);
  const [dateSheet, setDateSheet] = useState(false);

  // No advisory backend yet — the stage guides arrive with the 5-crop
  // agronomist content (tasks.md §6.1); until then the empty state renders.
  const stages: StageWithStatus[] = [];
  const day0 = new Date(plantingDate + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayOffset = Math.floor((today.getTime() - day0.getTime()) / DAY_MS);
  const label = cropLabel(cropId);
  const isPoultry = cropId === 'poultry' || cropId === 'broiler';
  const dateWord = isPoultry ? 'Stocked' : 'Planted';
  const futureWord = isPoultry ? 'Stocking' : 'Planting';
  const dateNoun = isPoultry ? 'stocking date' : 'planting date';
  const daysElapsed = todayOffset;

  const pickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    navigation.setParams({ plantingDate: toISO(d) });
    setDateSheet(false);
    setOpenId(null);
  };

  const quickPicks: [string, number][] = [['Today', 0], ['1 week ago', -7], ['1 month ago', -30]];

  if (stages.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        <ScreenHeader title={`${label} Journey`} />
        <FsEmpty
          icon="leaf"
          title="Growing guide coming soon"
          sub={`We're preparing the stage-by-stage ${label} guide. Check back shortly.`}
        />
      </SafeAreaView>
    );
  }

  const doneCount = stages.filter(s => s.status === 'done').length;
  const pct = Math.round((doneCount / stages.length) * 100);
  const current = stages.find(s => s.status === 'current');
  const currentIdx = current ? stages.findIndex(s => s.id === current.id) : Math.min(doneCount, stages.length - 1);

  const statusBadge = (status: 'done' | 'current' | 'upcoming') => {
    if (status === 'done') return <FsBadge tone="green">PASSED</FsBadge>;
    if (status === 'current') return <FsBadge tone="amber">HAPPENING NOW</FsBadge>;
    return <FsBadge tone="gray">UPCOMING</FsBadge>;
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScreenHeader
        title={`${label} Journey`}
        subtitle={(daysElapsed >= 0 ? dateWord : futureWord) + ' ' + fmtDateFull(day0) + (daysElapsed >= 0 ? ` · Day ${daysElapsed}` : ` · in ${-daysElapsed} days`)}
      />

      <ScrollView className="flex-1" contentContainerClassName="p-4" showsVerticalScrollIndicator={false}>
        {/* Progress summary card */}
        <View className="bg-card rounded-md border border-line p-[14px] mb-4" style={shadows.card}>
          <View className="flex-row items-start mb-[10px]">
            <View className="flex-1">
              <Text className="font-p-semibold text-[10.5px] text-sub tracking-[0.4px] uppercase">Stage {currentIdx + 1} of {stages.length}</Text>
              <Text className="font-m-bold text-[15.5px] text-ink mt-[2px]" numberOfLines={1}>{current ? current.name : doneCount === stages.length ? 'Season complete' : stages[currentIdx].name}</Text>
            </View>
            <Pressable onPress={() => setDateSheet(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="font-p-semibold text-[11.5px] text-green ml-[10px]">Change date</Text>
            </Pressable>
          </View>
          <FsProgress pct={pct} h={7} />
          <View className="flex-row justify-between mt-[7px]">
            <Text className="font-p-regular text-[10.5px] text-sub"><Text className="font-p-semibold text-ink">{doneCount}/{stages.length}</Text> stages passed</Text>
            <Text className="font-p-regular text-[10.5px] text-sub">{pct}% of the journey</Text>
          </View>
        </View>

        {/* Timeline */}
        {stages.map((s, idx) => {
          const isOpen = openId === s.id;
          const done = s.status === 'done';
          const cur = s.status === 'current';
          const win = fmtDate(s.fromDate) + (s.to !== s.from ? ' – ' + fmtDate(s.toDate) : '');
          const inputs = s.inputs.map(fsProduct).filter(Boolean);
          const isLast = idx === stages.length - 1;
          return (
            <View key={s.id} className="flex-row">
              {/* Timeline rail */}
              <View className="w-6 items-center">
                <View className={cn('w-[18px] h-[18px] rounded-full border-[1.5px] items-center justify-center mt-5', done ? 'bg-green border-green' : cur ? 'bg-card border-amber' : 'bg-field border-line')}>
                  {done ? <Icon name="Check" size={11} color="#fff" /> : <View className={cn('w-[6px] h-[6px] rounded-full', cur ? 'bg-amber' : 'bg-faint')} />}
                </View>
                {!isLast && <View className={cn('flex-1 w-[2px] mt-[2px] -mb-[7px]', done ? 'bg-limeLine' : 'bg-line')} />}
              </View>

              {/* Stage card */}
              <View className={cn('flex-1 bg-card rounded-md border mb-[9px] ml-2 overflow-hidden', cur ? 'border-[1.8px] border-amber' : 'border-line')}>
                <Pressable className="flex-row items-center gap-[11px] p-[10px]" onPress={() => setOpenId(isOpen ? null : s.id)}>
                  <Image source={STAGE_IMAGES[s.img]} style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: colors.field, opacity: done ? 0.55 : 1 }} resizeMode="cover" />
                  <View className="flex-1 min-w-0">
                    <Text className="font-p-semibold text-[9px] text-sub tracking-[0.4px]">{s.phase.toUpperCase()} · {win.toUpperCase()}</Text>
                    <Text className={cn('font-p-semibold text-[13px] mt-[2px] mb-1', done ? 'text-sub' : 'text-ink')} numberOfLines={1}>{s.name}</Text>
                    <View className="flex-row">{statusBadge(s.status)}</View>
                  </View>
                  <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={16} color={colors.faint} />
                </Pressable>

                {isOpen && (
                  <View className="border-t border-line">
                    <Image source={STAGE_IMAGES[s.img]} style={{ width: '100%', height: 160, backgroundColor: colors.field }} resizeMode="cover" />
                    <View className="p-[13px]">
                      <Text className="font-p-semibold text-[12px] text-green leading-[18px] mb-[6px]">{s.goal}</Text>

                      {s.details.map((d, i) => (
                        <View key={i} className={cn('flex-row gap-[9px] py-2', i < s.details.length - 1 && 'border-b border-line')}>
                          <View className="w-[19px] h-[19px] rounded-full bg-limeTint items-center justify-center mt-[1px]">
                            <Text className="font-m-bold text-[10px] text-green">{i + 1}</Text>
                          </View>
                          <Text className="flex-1 font-p-regular text-[11.5px] text-ink leading-[17px]">{d}</Text>
                        </View>
                      ))}

                      <View className="flex-row gap-2 bg-amberTint rounded-sm px-[11px] py-[9px] mt-[10px]">
                        <Icon name="Zap" size={14} color={colors.amberInk} style={{ marginTop: 2 }} />
                        <Text className="flex-1 font-p-regular text-[10.5px] text-amberInk leading-4"><Text className="font-p-semibold">Tip: </Text>{s.tip}</Text>
                      </View>

                      {inputs.length > 0 && (
                        <>
                          <Text className="font-p-semibold text-[10.5px] text-sub tracking-[0.4px] mt-3 mb-[7px]">INPUTS FOR THIS STAGE</Text>
                          {inputs.map(p => (
                            <View key={p!.id} className="flex-row items-center gap-[10px] bg-field rounded-sm p-[10px] mb-[7px]">
                              <View className="flex-1">
                                <Text className="font-p-medium text-[11px] text-ink leading-[15px]" numberOfLines={2}>{p!.name}</Text>
                                <Text className="font-m-bold text-[12px] text-green mt-[2px]">{naira(p!.price)}</Text>
                              </View>
                              <FsButton size="sm" label="Add to Cart" onPress={() => addToCart(p!.id)} />
                            </View>
                          ))}
                        </>
                      )}

                      <Pressable className="flex-row items-center gap-[7px] mt-[10px]" onPress={() => navigation.navigate('Activity', { stageId: s.id, cropId, plantingDate })}>
                        <Icon name="BookOpen" size={14} color={colors.green} />
                        <Text className="font-p-semibold text-[11.5px] text-green">Open the full stage guide</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Change date sheet */}
      <BottomSheet open={dateSheet} onClose={() => setDateSheet(false)} title={isPoultry ? 'Change stocking date' : 'Change planting date'}>
        <Text className="font-p-regular text-[11.5px] text-sub leading-[17px] mb-3">Pick a new {dateNoun} — stages before that date will be marked as passed, and we’ll line up what’s next.</Text>
        <View className="flex-row justify-between items-center bg-field rounded-sm px-[13px] py-[11px] mb-3">
          <Text className="font-p-regular text-[11.5px] text-sub">Current {dateNoun}</Text>
          <Text className="font-m-bold text-[13px] text-ink">{fmtDateFull(day0)}</Text>
        </View>
        {quickPicks.map(([l, off]) => {
          const d = new Date();
          d.setDate(d.getDate() + off);
          return (
            <Pressable key={l} className="flex-row items-center gap-[10px] bg-card border border-line rounded-sm px-[13px] py-3 mb-2" onPress={() => pickDate(off)}>
              <Icon name="Calendar" size={16} color={colors.green} />
              <Text className="flex-1 font-p-semibold text-[12.5px] text-ink">{l}</Text>
              <Text className="font-p-regular text-[11px] text-sub">{fmtDateFull(d)}</Text>
            </Pressable>
          );
        })}
        <View style={{ height: 8 }} />
      </BottomSheet>
    </SafeAreaView>
  );
}
