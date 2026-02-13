import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Iconify } from "react-native-iconify";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { toast } from "sonner-native";

export default function CardsScreen() {
  const t = useThemeColors();
  const userName = useAuthStore((s) => s.user?.name ?? "Alexander Doe");
  const [cardFrozen, setCardFrozen] = React.useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: t.bg }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-5 pt-4 pb-6">
            <Text className="text-2xl font-bold" style={{ color: t.textPrimary }}>My Cards</Text>
          </View>

          {/* Debit Card Visual */}
          <View
            className="mx-5 rounded-3xl overflow-hidden"
            style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}
          >
            <View className="p-6">
              {/* Card Type */}
              <View className="flex-row items-center justify-between mb-8">
                <Text className="text-sm font-medium" style={{ color: t.textSecondary }}>
                  Debit Card
                </Text>
                <Text className="text-base font-bold" style={{ color: t.textPrimary }}>FLUX</Text>
              </View>

              {/* Chip & NFC */}
              <View className="flex-row items-center gap-3 mb-8">
                <View className="h-8 w-10 rounded-md bg-[#FBBF24]/80" />
                <View className="h-6 w-6 items-center justify-center">
                  <Iconify icon="mdi:contactless-payment" size={16} color={t.textSecondary} />
                </View>
              </View>

              {/* Card Number */}
              <Text
                className="text-lg tracking-widest mb-6 font-mono"
                style={{ color: t.textPrimary }}
              >
                •••• •••• •••• 2912
              </Text>

              {/* Card Holder & Expiry */}
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xs mb-1" style={{ color: t.textSecondary }}>
                    CARD HOLDER
                  </Text>
                  <Text className="text-sm font-medium" style={{ color: t.textPrimary }}>
                    {userName}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs mb-1" style={{ color: t.textSecondary }}>EXPIRES</Text>
                  <Text className="text-sm font-medium" style={{ color: t.textPrimary }}>12/25</Text>
                </View>
                <View className="flex-row -space-x-2">
                  <View className="h-8 w-8 rounded-full bg-red-500/80" />
                  <View className="h-8 w-8 rounded-full bg-orange-400/80 -ml-3" />
                </View>
              </View>
            </View>
          </View>

          {/* Card Action Buttons */}
          <View className="flex-row px-5 pt-6 gap-3">
            {[
              { icon: "mdi:snowflake", label: cardFrozen ? "Unfreeze" : "Freeze" },
              { icon: "mdi:file-document-outline", label: "Details" },
              { icon: "mdi:refresh", label: "Replace" },
              { icon: "mdi:cog-outline", label: "Manage" },
            ].map(({ icon, label }) => (
              <Pressable
                key={label}
                className="flex-1 items-center gap-2 rounded-2xl py-4"
                style={({ pressed }) => ({
                  backgroundColor: pressed ? t.surfaceElevated : t.surface,
                })}
                onPress={() => {
                  if (label === "Freeze" || label === "Unfreeze") {
                    setCardFrozen(!cardFrozen);
                    toast(cardFrozen ? "Card unfrozen" : "Card frozen");
                  } else if (label === "Details") {
                    toast("Card ending in 2912 — Expires 12/25");
                  } else if (label === "Replace") {
                    toast("Card replacement requested");
                  } else {
                    toast("Card management coming soon");
                  }
                }}
              >
                <View
                  className="h-10 w-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: t.surfaceElevated }}
                >
                  <Iconify icon={icon} size={18} color={t.iconDefault} />
                </View>
                <Text className="text-xs font-medium" style={{ color: t.textSecondary }}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Virtual Cards Section */}
          <View className="pt-8">
            <View className="flex-row items-center justify-between px-5 mb-4">
              <Text className="text-lg font-semibold" style={{ color: t.textPrimary }}>
                Virtual Cards
              </Text>
              <Pressable hitSlop={8}>
                <Text className="text-sm font-medium text-[#9FE870]">
                  See All
                </Text>
              </Pressable>
            </View>

            {/* Virtual card items */}
            {[
              {
                name: "Online Shopping",
                number: "•••• 8831",
                balance: "₱2,500.00",
              },
              {
                name: "Subscriptions",
                number: "•••• 6612",
                balance: "₱500.00",
              },
            ].map((card) => (
              <Pressable
                key={card.number}
                className="flex-row items-center gap-4 mx-5 mb-3 p-4 rounded-2xl"
                style={({ pressed }) => ({
                  backgroundColor: pressed ? t.surfaceElevated : t.surface,
                })}
              >
                <View
                  className="h-10 w-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: t.surfaceElevated }}
                >
                  <Iconify icon="mdi:credit-card-outline" size={18} color="#9FE870" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium" style={{ color: t.textPrimary }}>
                    {card.name}
                  </Text>
                  <Text className="text-sm" style={{ color: t.textSecondary }}>{card.number}</Text>
                </View>
                <Text className="text-base font-semibold" style={{ color: t.textPrimary }}>
                  {card.balance}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Create New Card */}
          <View className="px-5 pt-6">
            <Pressable
              className="flex-row items-center justify-center gap-2 rounded-2xl border border-dashed py-4"
              style={({ pressed }) => ({
                borderColor: t.borderDashed,
                backgroundColor: pressed
                  ? (t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)")
                  : "transparent",
              })}
              onPress={() => toast("Virtual card created!")}
            >
              <Iconify icon="mdi:plus" size={18} color="#9FE870" />
              <Text className="text-base font-medium text-[#9FE870]">
                Create new card
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
