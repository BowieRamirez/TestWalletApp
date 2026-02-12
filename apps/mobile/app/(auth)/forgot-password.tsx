import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Iconify } from "react-native-iconify";
import { Button, Input } from "@mybank/ui";
import { toast } from "sonner-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const t = useThemeColors();

  const handleReset = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
      toast.success("Reset link sent!", {
        description: "Check your email for the password reset link.",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: t.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="px-5 pt-4"
          >
            <View
              className="h-10 w-10 rounded-full items-center justify-center"
              style={{ backgroundColor: t.surface }}
            >
              <Iconify icon="mdi:arrow-left" size={20} color={t.textPrimary} />
            </View>
          </Pressable>

          <View className="flex-1 justify-center px-6 gap-8">
            {/* Icon */}
            <View className="items-center">
              <View
                className="h-20 w-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: "#9FE870" + "20" }}
              >
                <Iconify icon="mdi:lock-reset" size={40} color="#9FE870" />
              </View>
            </View>

            {/* Header */}
            <View className="gap-2 items-center">
              <Text
                className="text-2xl font-bold text-center"
                style={{ color: t.textPrimary }}
              >
                {sent ? "Check your email" : "Forgot Password?"}
              </Text>
              <Text className="text-base text-center" style={{ color: t.textSecondary }}>
                {sent
                  ? `We've sent a password reset link to ${email}`
                  : "Enter your email address and we'll send you a link to reset your password."}
              </Text>
            </View>

            {sent ? (
              <View className="gap-4">
                <Button
                  onPress={() => {
                    setSent(false);
                    setEmail("");
                  }}
                  variant="outline"
                  fullWidth
                  size="lg"
                >
                  Try another email
                </Button>
                <Button
                  onPress={() => router.back()}
                  fullWidth
                  size="lg"
                >
                  Back to Sign In
                </Button>
              </View>
            ) : (
              <View className="gap-4">
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon={<Iconify icon="mdi:email-outline" size={18} color={t.iconMuted} />}
                />

                <Button
                  onPress={handleReset}
                  loading={loading}
                  fullWidth
                  size="lg"
                >
                  Send Reset Link
                </Button>
              </View>
            )}

            {/* Back to login */}
            {!sent && (
              <View className="flex-row items-center justify-center gap-1">
                <Text className="text-sm" style={{ color: t.textSecondary }}>
                  Remember your password?
                </Text>
                <Pressable onPress={() => router.back()} hitSlop={8}>
                  <Text className="text-sm text-[#9FE870] font-medium">
                    Sign In
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
