import React from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Button, Input, Card, Avatar } from "@mybank/ui";
import { useTransferWizard } from "@/features/transfers/stores/transfer-wizard-store";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { toast } from "sonner-native";

type Step = "recipient" | "amount" | "review" | "pin";

export default function TransferWizardScreen() {
  const {
    step,
    recipient,
    amount,
    pin,
    setRecipient,
    setAmount,
    setPin,
    nextStep,
    prevStep,
    reset,
  } = useTransferWizard();
  const t = useThemeColors();

  const handleConfirm = async () => {
    // Simulate transfer processing
    toast("Processing transfer...");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    reset();
    router.replace("/(modals)/receipt");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: t.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, gap: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress indicator */}
        <View className="flex-row gap-2">
          {(["recipient", "amount", "review", "pin"] as Step[]).map((s, i) => (
            <View
              key={s}
              className="flex-1 h-1 rounded-full"
              style={{
                backgroundColor:
                  i <= ["recipient", "amount", "review", "pin"].indexOf(step)
                    ? "#9FE870"
                    : t.surfaceElevated,
              }}
            />
          ))}
        </View>

        {/* Step: Recipient */}
        {step === "recipient" && (
          <View className="gap-4">
            <Text className="text-xl font-bold" style={{ color: t.textPrimary }}>
              Who are you sending to?
            </Text>
            <Input
              label="Recipient Name"
              placeholder="Enter recipient name"
              value={recipient.name}
              onChangeText={(text) =>
                setRecipient({ ...recipient, name: text })
              }
            />
            <Input
              label="Account Number"
              placeholder="Enter account number"
              value={recipient.accountNumber}
              onChangeText={(text) =>
                setRecipient({ ...recipient, accountNumber: text })
              }
              keyboardType="number-pad"
            />
            <Button
              onPress={nextStep}
              fullWidth
              disabled={!recipient.name || !recipient.accountNumber}
            >
              Continue
            </Button>
          </View>
        )}

        {/* Step: Amount */}
        {step === "amount" && (
          <View className="gap-4">
            <Text className="text-xl font-bold" style={{ color: t.textPrimary }}>
              How much?
            </Text>
            <Input
              label="Amount (PHP)"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <View className="flex-row gap-3">
              <Button variant="outline" onPress={prevStep}>
                Back
              </Button>
              <View className="flex-1">
                <Button onPress={nextStep} fullWidth disabled={!amount}>
                  Continue
                </Button>
              </View>
            </View>
          </View>
        )}

        {/* Step: Review */}
        {step === "review" && (
          <View className="gap-4">
            <Text className="text-xl font-bold" style={{ color: t.textPrimary }}>
              Review Transfer
            </Text>
            <Card variant="outlined" padding="md">
              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <Avatar name={recipient.name} size="md" />
                  <View>
                    <Text className="text-base font-semibold" style={{ color: t.textPrimary }}>
                      {recipient.name}
                    </Text>
                    <Text className="text-sm" style={{ color: t.textSecondary }}>
                      ••••{recipient.accountNumber.slice(-4)}
                    </Text>
                  </View>
                </View>
                <View style={{ borderTopWidth: 1, borderColor: t.border, paddingTop: 12 }}>
                  <Text className="text-sm" style={{ color: t.textSecondary }}>Amount</Text>
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: t.textPrimary, fontVariant: ["tabular-nums"] }}
                  >
                    ₱{parseFloat(amount || "0").toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card>
            <View className="flex-row gap-3">
              <Button variant="outline" onPress={prevStep}>
                Back
              </Button>
              <View className="flex-1">
                <Button onPress={nextStep} fullWidth>
                  Confirm & Enter PIN
                </Button>
              </View>
            </View>
          </View>
        )}

        {/* Step: PIN */}
        {step === "pin" && (
          <View className="gap-4">
            <Text className="text-xl font-bold" style={{ color: t.textPrimary }}>
              Enter your PIN
            </Text>
            <Input
              label="Transaction PIN"
              placeholder="••••"
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={6}
            />
            <View className="flex-row gap-3">
              <Button variant="outline" onPress={prevStep}>
                Back
              </Button>
              <View className="flex-1">
                <Button
                  onPress={handleConfirm}
                  fullWidth
                  disabled={pin.length < 4}
                >
                  Send Money
                </Button>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
