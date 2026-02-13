import React from "react";
import { View, Text, Share } from "react-native";
import { router } from "expo-router";
import { Iconify } from "react-native-iconify";
import { Button, Card } from "@mybank/ui";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { toast } from "sonner-native";

export default function ReceiptScreen() {
  const t = useThemeColors();
  const refId = `TXN-${Date.now().toString(36).toUpperCase()}`;
  const dateStr = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Flux Transfer Receipt\nRef: ${refId}\nDate: ${dateStr}\nStatus: Completed`,
      });
    } catch {
      toast("Could not share receipt");
    }
  };

  return (
    <View
      className="flex-1 items-center justify-center px-6 gap-6"
      style={{ backgroundColor: t.bg }}
    >
      {/* Success Icon */}
      <View className="h-20 w-20 items-center justify-center rounded-full bg-[#9FE870]/20">
        <Iconify icon="mdi:check-circle" size={48} color="#9FE870" />
      </View>

      <View className="items-center gap-2">
        <Text className="text-2xl font-bold" style={{ color: t.textPrimary }}>
          Transfer Successful!
        </Text>
        <Text className="text-base text-center" style={{ color: t.textSecondary }}>
          Your money has been sent successfully.
        </Text>
      </View>

      <Card
        variant="outlined"
        padding="md"
        className="w-full"
        colors={{ bg: t.surface, border: t.border }}
      >
        <View className="gap-3">
          <View className="flex-row justify-between">
            <Text className="text-sm" style={{ color: t.textSecondary }}>Reference</Text>
            <Text className="text-sm font-medium" style={{ color: t.textPrimary }} selectable>
              {refId}
            </Text>
          </View>
          <View className="h-px" style={{ backgroundColor: t.border }} />
          <View className="flex-row justify-between">
            <Text className="text-sm" style={{ color: t.textSecondary }}>Date</Text>
            <Text className="text-sm font-medium" style={{ color: t.textPrimary }}>
              {dateStr}
            </Text>
          </View>
          <View className="h-px" style={{ backgroundColor: t.border }} />
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
          onPress={handleShare}
        >
          Share Receipt
        </Button>
      </View>
    </View>
  );
}
