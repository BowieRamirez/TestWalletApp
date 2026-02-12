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
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const t = useThemeColors();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // For now, register = login (mock)
      await login(email, password);
      router.replace("/(tabs)/(home)");
    } catch (e) {
      setError("Registration failed. Please try again.");
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
          <View className="flex-1 justify-center px-6 gap-8">
            {/* Header */}
            <View className="gap-2">
              <Text className="text-3xl font-bold" style={{ color: t.textPrimary }}>
                Create account
              </Text>
              <Text className="text-base" style={{ color: t.textSecondary }}>
                Sign up to get started with Flux
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                leftIcon={<Iconify icon="mdi:account-outline" size={18} color={t.textSecondary} />}
                error={
                  error && !fullName ? "Full name is required" : undefined
                }
              />
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={<Iconify icon="mdi:email-outline" size={18} color={t.textSecondary} />}
                error={error && !email ? "Email is required" : undefined}
              />
              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Iconify icon="mdi:lock-outline" size={18} color={t.textSecondary} />}
                error={error && !password ? "Password is required" : undefined}
              />

              {error ? (
                <Text className="text-sm text-red-500 text-center">
                  {error}
                </Text>
              ) : null}

              <Button
                onPress={handleRegister}
                loading={loading}
                fullWidth
                size="lg"
              >
                Sign Up
              </Button>
            </View>

            {/* Divider */}
            <View className="flex-row items-center gap-4">
              <View className="flex-1 h-px" style={{ backgroundColor: t.border }} />
              <Text className="text-sm" style={{ color: t.textSecondary }}>or continue with</Text>
              <View className="flex-1 h-px" style={{ backgroundColor: t.border }} />
            </View>

            {/* Social buttons */}
            <View className="flex-row gap-4">
              <Pressable
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3.5"
                style={({ pressed }) => ({
                  backgroundColor: pressed ? t.surfaceElevated : t.surface,
                  borderWidth: 1,
                  borderColor: t.border,
                })}
              >
                <Iconify icon="mdi:google" size={20} color={t.iconDefault} />
                <Text className="text-base font-medium" style={{ color: t.textPrimary }}>
                  Google
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3.5"
                style={({ pressed }) => ({
                  backgroundColor: pressed ? t.surfaceElevated : t.surface,
                  borderWidth: 1,
                  borderColor: t.border,
                })}
              >
                <Iconify icon="mdi:apple" size={20} color={t.iconDefault} />
                <Text className="text-base font-medium" style={{ color: t.textPrimary }}>
                  Apple
                </Text>
              </Pressable>
            </View>

            {/* Sign in link */}
            <View className="flex-row items-center justify-center gap-1">
              <Text className="text-sm" style={{ color: t.textSecondary }}>
                Already have an account?
              </Text>
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <Text className="text-sm text-[#9FE870] font-medium">
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
