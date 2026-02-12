import React, { useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Iconify } from "react-native-iconify";
import { TransactionItem } from "@mybank/ui";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function HomeScreen() {
  const { data: accounts, isLoading, refetch } = useAccounts();
  const userName = useAuthStore((s) => s.user?.name ?? "User");
  const t = useThemeColors();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const totalBalance = accounts?.totalBalance ?? 24500.0;

  // Transaction icons mapping
  const getTransactionIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("shop") || lower.includes("store"))
      return <Iconify icon="mdi:shopping-outline" size={18} color="#9FE870" />;
    if (lower.includes("coffee") || lower.includes("food"))
      return <Iconify icon="mdi:coffee-outline" size={18} color="#FBBF24" />;
    if (lower.includes("electric") || lower.includes("util"))
      return <Iconify icon="mdi:flash" size={18} color="#60A5FA" />;
    if (lower.includes("internet") || lower.includes("wifi"))
      return <Iconify icon="mdi:wifi" size={18} color="#A78BFA" />;
    return <Iconify icon="mdi:shopping-outline" size={18} color="#9FE870" />;
  };

  return (
    <View className="flex-1" style={{ backgroundColor: t.bg }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#9FE870"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-6">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 rounded-full bg-[#9FE870] items-center justify-center">
                <Text className="text-base font-bold text-black">
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text className="text-sm" style={{ color: t.textSecondary }}>Welcome back,</Text>
                <Text className="text-base font-semibold" style={{ color: t.textPrimary }}>
                  {userName}
                </Text>
              </View>
            </View>
            <Pressable
              className="h-10 w-10 rounded-full items-center justify-center"
              style={{ backgroundColor: t.surface }}
            >
              <Iconify icon="mdi:bell-outline" size={20} color={t.iconDefault} />
            </Pressable>
          </View>

          {/* Balance Card */}
          <View className="mx-5 rounded-3xl overflow-hidden" style={{ backgroundColor: "#9FE870" }}>
            <View className="px-6 pt-6 pb-6">
              <Text className="text-sm font-medium text-black/60 mb-1">
                Main Account
              </Text>
              <Text
                className="text-4xl font-bold text-black mb-1"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                ₱{totalBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </Text>
              <Text className="text-sm text-black/50">
                {accounts?.primaryAccountNumber
                  ? `•••• ${accounts.primaryAccountNumber.slice(-4)}`
                  : "•••• 4832"}
              </Text>
            </View>
          </View>

          {/* Quick Action Buttons */}
          <View className="flex-row gap-3 px-5 pt-6">
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-4"
              style={({ pressed }) => ({
                backgroundColor: pressed ? t.surfaceElevated : t.surface,
              })}
            >
              <View className="h-8 w-8 rounded-full bg-[#9FE870] items-center justify-center">
                <Iconify icon="mdi:arrow-top-right" size={16} color="#000" />
              </View>
              <Text className="text-base font-medium" style={{ color: t.textPrimary }}>Send</Text>
            </Pressable>
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-4"
              style={({ pressed }) => ({
                backgroundColor: pressed ? t.surfaceElevated : t.surface,
              })}
            >
              <View
                className="h-8 w-8 rounded-full items-center justify-center"
                style={{ backgroundColor: t.surfaceElevated }}
              >
                <Iconify icon="mdi:arrow-bottom-left" size={16} color={t.iconDefault} />
              </View>
              <Text className="text-base font-medium" style={{ color: t.textPrimary }}>Request</Text>
            </Pressable>
          </View>

          {/* All Activity */}
          <View className="pt-6">
            <View className="flex-row items-center justify-between px-5 mb-4">
              <Text className="text-lg font-semibold" style={{ color: t.textPrimary }}>
                All Activity
              </Text>
              <Pressable hitSlop={8}>
                <Text className="text-sm font-medium text-[#9FE870]">
                  See All
                </Text>
              </Pressable>
            </View>

            <View className="mx-5 rounded-2xl overflow-hidden" style={{ backgroundColor: t.surface }}>
              {(accounts?.recentTransactions ?? []).length > 0 ? (
                accounts!.recentTransactions.map((tx, idx) => (
                  <TransactionItem
                    key={tx.id ?? idx}
                    title={tx.title}
                    subtitle={tx.date}
                    amount={tx.amount}
                    type={tx.type}
                    icon={getTransactionIcon(tx.title)}
                  />
                ))
              ) : (
                /* Fallback mock transactions */
                <>
                  <TransactionItem
                    title="Shopping Store"
                    subtitle="Today, 2:30 PM"
                    amount={85.5}
                    type="debit"
                    currency="PHP"
                    icon={<Iconify icon="mdi:shopping-outline" size={18} color="#9FE870" />}
                  />
                  <TransactionItem
                    title="Coffee Shop"
                    subtitle="Today, 10:15 AM"
                    amount={4.5}
                    type="debit"
                    currency="PHP"
                    icon={<Iconify icon="mdi:coffee-outline" size={18} color="#FBBF24" />}
                  />
                  <TransactionItem
                    title="Salary Deposit"
                    subtitle="Yesterday"
                    amount={3200.0}
                    type="credit"
                    currency="PHP"
                    icon={<Iconify icon="mdi:arrow-bottom-left" size={18} color="#9FE870" />}
                  />
                  <TransactionItem
                    title="Electric Bill"
                    subtitle="Jun 15"
                    amount={120.0}
                    type="debit"
                    currency="PHP"
                    icon={<Iconify icon="mdi:flash" size={18} color="#60A5FA" />}
                  />
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
