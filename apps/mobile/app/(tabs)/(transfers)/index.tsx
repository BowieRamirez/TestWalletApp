import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Iconify } from "react-native-iconify";
import { useThemeColors } from "@/hooks/use-theme-colors";

const PERIODS = ["Week", "Month", "Year"] as const;

const spendingData: Record<string, { bars: number[]; days: string[]; total: string }> = {
  Week: {
    bars: [40, 65, 45, 80, 55, 90, 70],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    total: "₱3,580.00",
  },
  Month: {
    bars: [60, 75, 50, 85, 70, 40, 65, 90, 55, 80, 45, 70],
    days: ["W1", "W2", "W3", "W4", "", "", "", "", "", "", "", ""],
    total: "₱14,320.00",
  },
  Year: {
    bars: [55, 70, 80, 65, 75, 90, 85, 60, 70, 95, 80, 75],
    days: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    total: "₱171,840.00",
  },
};

const categories = [
  {
    name: "Shopping",
    amount: "₱1,240.00",
    percentage: 35,
    icon: "mdi:shopping-outline",
    color: "#9FE870",
  },
  {
    name: "Food & Drink",
    amount: "₱860.00",
    percentage: 24,
    icon: "mdi:coffee-outline",
    color: "#FBBF24",
  },
  {
    name: "Transport",
    amount: "₱540.00",
    percentage: 15,
    icon: "mdi:car",
    color: "#60A5FA",
  },
  {
    name: "Entertainment",
    amount: "₱320.00",
    percentage: 9,
    icon: "mdi:filmstrip",
    color: "#A78BFA",
  },
  {
    name: "Bills",
    amount: "₱620.00",
    percentage: 17,
    icon: "mdi:file-document-outline",
    color: "#FF6467",
  },
];

export default function AnalyticsScreen() {
  const t = useThemeColors();
  const [selectedPeriod, setSelectedPeriod] = React.useState<(typeof PERIODS)[number]>("Month");

  const currentData = spendingData[selectedPeriod];
  const displayBars = selectedPeriod === "Week" ? currentData.bars : currentData.bars.slice(0, selectedPeriod === "Month" ? 4 : 12);
  const displayDays = selectedPeriod === "Week" ? currentData.days : currentData.days.slice(0, selectedPeriod === "Month" ? 4 : 12);

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
            <Text className="text-2xl font-bold" style={{ color: t.textPrimary }}>Analytics</Text>
          </View>

          {/* Period Selector */}
          <View className="flex-row px-5 mb-6 gap-2">
            {PERIODS.map((period) => {
              const isActive = period === selectedPeriod;
              return (
                <Pressable
                  key={period}
                  className="px-5 py-2.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? "#9FE870" : t.surface,
                    borderWidth: isActive ? 0 : 1,
                    borderColor: isActive ? undefined : t.border,
                  }}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{ color: isActive ? "#000000" : t.textPrimary }}
                  >
                    {period}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Spending Chart */}
          <View className="mx-5 rounded-2xl p-6 mb-6" style={{ backgroundColor: t.surface }}>
            {/* Bar chart */}
            <View className="flex-row items-end justify-between h-32 gap-2 mb-4">
              {displayBars.map((height, idx) => {
                const maxIdx = displayBars.indexOf(Math.max(...displayBars));
                return (
                  <View key={idx} className="flex-1 items-center">
                    <View
                      className="w-full rounded-lg"
                      style={{
                        height: `${height}%`,
                        backgroundColor:
                          idx === maxIdx ? "#9FE870" : "rgba(159, 232, 112, 0.2)",
                        borderRadius: 6,
                      }}
                    />
                  </View>
                );
              })}
            </View>
            <View className="flex-row justify-between">
              {displayDays.map((d, i) => (
                <Text key={`${d}-${i}`} className="text-xs" style={{ color: t.textSecondary }}>
                  {d}
                </Text>
              ))}
            </View>
          </View>

          {/* Total Spent */}
          <View className="mx-5 rounded-2xl p-5 mb-6" style={{ backgroundColor: t.surface }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm mb-1" style={{ color: t.textSecondary }}>
                  Total Spent
                </Text>
                <Text className="text-2xl font-bold" style={{ color: t.textPrimary }}>
                  {currentData.total}
                </Text>
              </View>
              <Pressable
                className="flex-row items-center gap-1 px-3 py-2 rounded-full"
                style={{ backgroundColor: t.surfaceElevated }}
              >
                <Text className="text-sm" style={{ color: t.textPrimary }}>This {selectedPeriod}</Text>
                <Iconify icon="mdi:chevron-down" size={14} color={t.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* Top Categories */}
          <View className="px-5">
            <Text className="text-lg font-semibold mb-4" style={{ color: t.textPrimary }}>
              Top Categories
            </Text>

            <View className="gap-3">
              {categories.map((cat) => {
                return (
                  <View
                    key={cat.name}
                    className="flex-row items-center gap-4 rounded-2xl p-4"
                    style={{ backgroundColor: t.surface }}
                  >
                    <View
                      className="h-10 w-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <Iconify icon={cat.icon} size={18} color={cat.color} />
                    </View>
                    <View className="flex-1 gap-2">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-base font-medium" style={{ color: t.textPrimary }}>
                          {cat.name}
                        </Text>
                        <Text className="text-base font-semibold" style={{ color: t.textPrimary }}>
                          {cat.amount}
                        </Text>
                      </View>
                      <View
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: t.surfaceElevated }}
                      >
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
