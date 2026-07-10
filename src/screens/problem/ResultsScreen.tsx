import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { FS_CROPS, fsProduct } from '../../data/products';
import FsButton from '../../components/common/FsButton';
import FsBadge from '../../components/common/FsBadge';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { PROBLEM_CATEGORIES, Diagnosis } from '../../data/problems';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

const cropLabel = (id: string) => {
  const found = FS_CROPS.find(([cid]) => cid === id);
  return found ? found[1] : id.charAt(0).toUpperCase() + id.slice(1);
};

const confidenceTone = (pct: number): 'green' | 'amber' | 'gray' => (pct >= 80 ? 'green' : pct >= 50 ? 'amber' : 'gray');

export default function ResultsScreen({ navigation, route }: { navigation: any; route: any }) {
  const { crop, category, results } = route.params as { crop: string; category: string; results?: Diagnosis[] };
  const diagnoses: Diagnosis[] = results ?? [];
  const { addToCart, toast } = useApp();
  const [openTreatment, setOpenTreatment] = useState<string | null>(null);

  const catLabel = PROBLEM_CATEGORIES.find(c => c.id === category)?.label || category;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Diagnosis Results" subtitle={`${cropLabel(crop)} · ${catLabel}`} />

      <ScrollView className="flex-1" contentContainerClassName="p-4" showsVerticalScrollIndicator={false}>
        {diagnoses.length > 0 ? (
          <>
            <Text className="font-m-bold text-[18px] text-ink leading-6">We found {diagnoses.length} possible matches</Text>
            <Text className="font-p-regular text-[11.5px] text-sub leading-[17px] mt-1 mb-[14px]">Start with the highest confidence match and confirm the symptoms.</Text>
          </>
        ) : (
          <View className="bg-card border border-line rounded-md p-[18px] items-center mb-3">
            <View className="w-12 h-12 rounded-full bg-limeTint items-center justify-center mb-[10px]">
              <Icon name="Microscope" size={22} color={colors.green} />
            </View>
            <Text className="font-m-bold text-[15px] text-ink text-center">Automated diagnosis isn’t available yet</Text>
            <Text className="font-p-regular text-[11.5px] text-sub text-center leading-[17px] mt-[6px]">We couldn’t generate matches for this problem. Talk to an agronomist below and we’ll help you directly.</Text>
          </View>
        )}

        {diagnoses.map((dx, i) => {
          const treatmentOpen = openTreatment === dx.id;
          const products = dx.products.map(fsProduct).filter(Boolean);
          return (
            <View key={dx.id} className={cn('bg-card border rounded-md p-[14px] mb-3', i === 0 ? 'border-[1.8px] border-green' : 'border-line')} style={shadows.card}>
              <View className="flex-row items-start justify-between gap-[9px] mb-2">
                <Text className="flex-1 font-m-bold text-[14.5px] text-ink leading-[19px]">{dx.title}</Text>
                <FsBadge tone={confidenceTone(dx.confidence)}>{dx.confidence}% MATCH</FsBadge>
              </View>

              <Text className="font-p-regular text-[11.5px] text-sub leading-[18px]">{dx.cause}</Text>

              <Text className="font-p-semibold text-[10px] text-sub tracking-[0.4px] mt-3 mb-[6px]">SYMPTOMS TO CONFIRM</Text>
              {dx.symptoms.map((s, si) => (
                <View key={si} className="flex-row gap-2 py-[3px]">
                  <Icon name="CircleCheck" size={14} color={colors.green} style={{ marginTop: 2 }} />
                  <Text className="flex-1 font-p-regular text-[11.5px] text-ink leading-[17px]">{s}</Text>
                </View>
              ))}

              {/* Expandable treatment */}
              <Pressable className="flex-row items-center gap-2 bg-field rounded-sm px-3 py-[10px] mt-3" onPress={() => setOpenTreatment(treatmentOpen ? null : dx.id)}>
                <Icon name="BriefcaseMedical" size={15} color={colors.green} />
                <Text className="flex-1 font-p-semibold text-[12px] text-ink">Treatment</Text>
                <Icon name={treatmentOpen ? 'ChevronUp' : 'ChevronDown'} size={15} color={colors.faint} />
              </Pressable>
              {treatmentOpen && (
                <View className="px-1 pt-1">
                  {dx.treatment.map((t, ti) => (
                    <View key={ti} className={cn('flex-row gap-[10px] py-2', ti < dx.treatment.length - 1 && 'border-b border-line')}>
                      <View className="w-5 h-5 rounded-full bg-limeTint items-center justify-center mt-[1px]">
                        <Text className="font-m-bold text-[10.5px] text-green">{ti + 1}</Text>
                      </View>
                      <Text className="flex-1 font-p-regular text-[11.5px] text-ink leading-[17px]">{t}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View className="flex-row gap-2 bg-limeTint rounded-sm px-[11px] py-[9px] mt-3">
                <Icon name="ShieldCheck" size={14} color={colors.green} style={{ marginTop: 2 }} />
                <Text className="flex-1 font-p-regular text-[10.5px] text-sub leading-4"><Text className="font-p-semibold text-green">Prevention: </Text>{dx.prevention}</Text>
              </View>

              {products.length > 0 && (
                <>
                  <Text className="font-p-semibold text-[10px] text-sub tracking-[0.4px] mt-3 mb-[6px]">RECOMMENDED PRODUCTS</Text>
                  {products.map(p => (
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

              <Text className="font-p-regular text-[10.5px] text-sub mt-2">Est. treatment cost: <Text className="font-p-semibold text-ink">{naira(dx.cost[0])} – {naira(dx.cost[1])}</Text></Text>
            </View>
          );
        })}

        {/* Expert fallback */}
        <View className="bg-card border-[1.5px] border-limeLine border-dashed rounded-md p-[18px] items-center mt-1">
          <View className="w-12 h-12 rounded-full bg-limeTint items-center justify-center mb-[10px]">
            <Icon name="Users" size={22} color={colors.green} />
          </View>
          <Text className="font-m-bold text-[14.5px] text-ink text-center leading-[19px]">Not what you’re seeing? Talk to an expert</Text>
          <Text className="font-p-regular text-[11.5px] text-sub text-center leading-[17px] mt-[6px] mb-[14px]">A certified agronomist will review your description and respond within 24 hours.</Text>
          <FsButton full kind="whatsapp" label="Chat with an Expert on WhatsApp" onPress={() => toast('Connecting you to an agronomist on WhatsApp…')} />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
