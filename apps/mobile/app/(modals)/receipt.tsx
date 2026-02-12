import React from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { Button, Card } from "@mybank/ui";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function ReceiptScreen() {
  const t = useThemeColors();

  return (
    <View
      className="flex-1 items-center justify-center px-6 gap-6"
      style={{ backgroundColor: t.bg }}
    >
      {/* Success Icon Placeholder */}
      <View className="h-20 w-20 items-center justify-center rounded-full bg-[#9FE870]/20">
        <Text className="text-4xl">✓</Text>
      </View>

      <View className="items-center gap-2">
        <Text className="text-2xl font-bold" style={{ color: t.textPrimary }}>
          Transfer Successful!
        </Text>
        <Text className="text-base text-center" style={{ color: t.textSecondary }}>
          Your money has been sent successfully.
        </Text>
      </View>

      <Card variant="outlined" padding="md" className="w-full">
        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text className="text-sm" style={{ color: t.textSecondary }}>Reference</Text>
            <Text className="text-sm font-medium" style={{ color: t.textPrimary }} selectable>
              TXN-{Date.now().toString(36).toUpperCase()}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm" style={{ color: t.textSecondary }}>Date</Text>
            <Text className="text-sm font-medium" style={{ color: t.textPrimary }}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm" style={{ color: t.textSecondary }}>Status</Text>
            <Text className="text-sm font-semibold text-[#9FE870]">
              Completed
            </Text>
          </View>
        </View>
      </Card>

      <View className="w-full gap-3">
        <Button fullWidth onPress={() => router.replace("/(tabs)/(home)")}>
          Back to Home
        </Button>
        <Button
          variant="outline"
          fullWidth
          onPress={() => {
            // TODO: Share receipt
          }}
        >
          Share Receipt
        </Button>
      </View>
    </View>
  );
}
