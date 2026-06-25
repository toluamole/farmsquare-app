import React from 'react';
import { View, Text, ScrollView, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import * as advisoryData from '../../data/advisory';
import { FS_JOURNEY_CROP, FS_CROP_TIMINGS, fsJourneyFor, JourneyStage } from '../../data/advisory';
import { fsProduct } from '../../data/products';
import FsButton from '../../components/common/FsButton';
import FsBadge from '../../components/common/FsBadge';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { STAGE_IMAGES } from './stageImages';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

const DAY_MS = 86400000;

const fmtDate = (d: Date) => d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ActivityScreen({ navigation, route }: { navigation: any; route: any }) {
  const { stageId, cropId, plantingDate } = route.params as { stageId: string; cropId: string; plantingDate: string };
  const { toast, addToCart } = useApp();

  const isPoultry = cropId === 'poultry' || cropId === 'broiler';
  const poultryStages: JourneyStage[] | undefined = (advisoryData as any).FS_JOURNEY_POULTRY;

  const label = isPoultry ? 'Poultry (Broilers)' : FS_CROP_TIMINGS[cropId]?.label || cropId.charAt(0).toUpperCase() + cropId.slice(1);

  let stage: (JourneyStage & { fromDate: Date; toDate: Date; status?: string }) | undefined;
  if (isPoultry && Array.isArray(poultryStages) && poultryStages.length > 0) {
    const day0 = new Date(plantingDate + 'T12:00:00');
    const base = poultryStages.find(s => s.id === stageId);
    if (base) {
      stage = { ...base, fromDate: new Date(day0.getTime() + base.from * DAY_MS), toDate: new Date(day0.getTime() + base.to * DAY_MS) };
    }
  } else {
    const { stages } = fsJourneyFor({ id: cropId, kind: 'crop', label, icon: 'seedling' }, plantingDate);
    stage = stages.find(s => s.id === stageId);
  }
  if (!stage) {
    const day0 = new Date(plantingDate + 'T12:00:00');
    const base = FS_JOURNEY_CROP.find(s => s.id === stageId) || FS_JOURNEY_CROP[0];
    stage = { ...base, fromDate: new Date(day0.getTime() + base.from * DAY_MS), toDate: new Date(day0.getTime() + base.to * DAY_MS) };
  }

  const window = fmtDate(stage.fromDate) + (stage.to !== stage.from ? ' – ' + fmtDate(stage.toDate) : '');

  const inputs = stage.inputs.map(fsProduct).filter(Boolean);

  const markDone = () => {
    toast('Great work! Stage marked as done');
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Stage Guide" subtitle={label} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Image source={STAGE_IMAGES[stage.img]} style={{ width: '100%', height: 180, backgroundColor: colors.field }} resizeMode="cover" />

        <View className="p-4">
          <View className="flex-row gap-[7px] mb-[9px]">
            <FsBadge tone="green">{stage.phase.toUpperCase()}</FsBadge>
            {stage.status === 'done' && <FsBadge tone="gray">PASSED</FsBadge>}
            {stage.status === 'current' && <FsBadge tone="amber">HAPPENING NOW</FsBadge>}
          </View>

          <Text className="font-m-bold text-[20px] text-ink leading-[26px]">{stage.name}</Text>

          <View className="flex-row items-center gap-[6px] mt-[7px]">
            <Icon name="Calendar" size={14} color={colors.sub} />
            <Text className="font-p-regular text-[11.5px] text-sub">{window}</Text>
          </View>

          <Text className="font-p-semibold text-[12.5px] text-green leading-[19px] mt-3">{stage.goal}</Text>

          <Text className="font-m-bold text-[14px] text-ink mt-[18px] mb-[9px]">What to do</Text>
          <View className="bg-card border border-line rounded-md px-[14px] py-1">
            {stage.details.map((s, i) => (
              <View key={i} className={cn('flex-row gap-[11px] py-[10px]', i < stage!.details.length - 1 && 'border-b border-line')}>
                <View className="w-[22px] h-[22px] rounded-full bg-limeTint items-center justify-center">
                  <Text className="font-m-bold text-[11px] text-green">{i + 1}</Text>
                </View>
                <Text className="flex-1 font-p-regular text-[12.5px] text-ink leading-[18px]">{s}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row gap-[10px] bg-amberTint rounded-md px-[13px] py-[11px] mt-[14px]">
            <Icon name="Zap" size={15} color={colors.amberInk} style={{ marginTop: 2 }} />
            <Text className="flex-1 font-p-regular text-[11.5px] text-amberInk leading-[17px]"><Text className="font-p-semibold">Tip: </Text>{stage.tip}</Text>
          </View>

          {inputs.length > 0 && (
            <>
              <Text className="font-m-bold text-[14px] text-ink mt-[18px] mb-[9px]">Inputs needed</Text>
              {inputs.map(p => (
                <View key={p!.id} className="flex-row items-center gap-[11px] bg-card border border-line rounded-md p-3 mb-2">
                  <View className="flex-1">
                    <Text className="font-p-medium text-[11.5px] text-ink leading-4" numberOfLines={2}>{p!.name}</Text>
                    <Text className="font-m-bold text-[12.5px] text-green mt-[2px]">{naira(p!.price)}</Text>
                  </View>
                  <FsButton size="sm" label="Add to Cart" onPress={() => addToCart(p!.id)} />
                </View>
              ))}
            </>
          )}

          <View style={{ height: 16 }} />
        </View>
      </ScrollView>

      <View className="px-4 pt-[10px] pb-4 bg-card border-t border-line">
        <FsButton full size="lg" label="Mark as Done" onPress={markDone} />
      </View>
    </SafeAreaView>
  );
}
