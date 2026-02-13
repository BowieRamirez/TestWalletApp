import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Iconify } from "react-native-iconify";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { toast } from "sonner-native";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  colors: ReturnType<typeof useThemeColors>;
}

function SettingsItem({ icon, label, value, onPress, trailing, colors: t }: SettingsItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 px-4 py-3.5"
      style={({ pressed }) => pressed ? { backgroundColor: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" } : {}}
    >
      <View
        className="h-10 w-10 rounded-full items-center justify-center"
        style={{ backgroundColor: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
      >
        {icon}
      </View>
      <Text className="flex-1 text-base" style={{ color: t.textPrimary }}>
        {label}
      </Text>
      {trailing ?? (
        <View className="flex-row items-center gap-2">
          {value ? (
            <Text className="text-sm" style={{ color: t.textSecondary }}>{value}</Text>
          ) : null}
          <Iconify icon="mdi:chevron-right" size={16} color={t.iconMuted} />
        </View>
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const toggleColorScheme = useThemeStore((s) => s.toggleColorScheme);
  const logout = useAuthStore((s) => s.logout);
  const userName = useAuthStore((s) => s.user?.name ?? "Alexander Doe");
  const t = useThemeColors();

  const isDark = colorScheme === "dark";

  const handleLogout = () => {
    logout();
    toast("Logged out successfully");
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: t.bg }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header row with Flux brand + gear icon */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
            <View className="flex-row items-center gap-2">
              <View className="h-7 w-7 rounded-full bg-[#9FE870] items-center justify-center">
                <Text className="text-xs font-bold text-black">F</Text>
              </View>
              <Text className="text-lg font-bold" style={{ color: t.textPrimary }}>Flux</Text>
            </View>
            <Pressable
              className="h-8 w-8 rounded-full items-center justify-center"
              style={{ backgroundColor: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
            >
              <Iconify icon="mdi:cog-outline" size={16} color={t.textSecondary} />
            </Pressable>
          </View>

          {/* Profile - Centered Avatar */}
          <View className="items-center py-6 gap-3">
            <View
              className="h-24 w-24 rounded-full bg-[#9FE870] items-center justify-center"
              style={{
                borderWidth: 3,
                borderColor: t.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              }}
            >
              <Text className="text-3xl font-bold text-black">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="items-center gap-1">
              <Text className="text-xl font-bold" style={{ color: t.textPrimary }}>
                {userName}
              </Text>
              <Text className="text-base" style={{ color: t.textSecondary }}>
                @{userName.toLowerCase().replace(/\s+/g, "")} • Flux Pro
              </Text>
            </View>
          </View>

          {/* Account Section */}
          <View className="mx-5 mb-6">
            <Text className="text-xs font-bold mb-3 px-2 tracking-wider" style={{ color: t.textSecondary }}>
              ACCOUNT
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: t.surface,
                borderWidth: 1,
                borderColor: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              }}
            >
              <SettingsItem
                icon={<Iconify icon="mdi:account-outline" size={20} color={t.textSecondary} />}
                label="Personal Information"
                value={userName}
                colors={t}
                onPress={() => toast("Personal info coming soon")}
              />
              <View className="h-px mx-4" style={{ backgroundColor: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
              <SettingsItem
                icon={<Iconify icon="mdi:earth" size={20} color={t.textSecondary} />}
                label="Language"
                value="English (US)"
                colors={t}
                onPress={() => toast("Language settings coming soon")}
              />
            </View>
          </View>

          {/* Preferences Section */}
          <View className="mx-5 mb-6">
            <Text className="text-xs font-bold mb-3 px-2 tracking-wider" style={{ color: t.textSecondary }}>
              PREFERENCES
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: t.surface,
                borderWidth: 1,
                borderColor: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              }}
            >
              <SettingsItem
                icon={<Iconify icon="mdi:bell-outline" size={20} color={t.textSecondary} />}
                label="Notifications"
                colors={t}
                onPress={() => {
                  setNotifications(!notifications);
                  toast(notifications ? "Notifications off" : "Notifications on");
                }}
                trailing={
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm" style={{ color: t.textSecondary }}>
                      {notifications ? "On" : "Off"}
                    </Text>
                    <Iconify icon="mdi:chevron-right" size={16} color={t.iconMuted} />
                  </View>
                }
              />
              <View className="h-px mx-4" style={{ backgroundColor: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
              <SettingsItem
                icon={<Iconify icon="mdi:weather-night" size={20} color={t.textSecondary} />}
                label="Dark Mode"
                colors={t}
                onPress={() => {
                  toggleColorScheme();
                  toast(isDark ? "Light mode enabled" : "Dark mode enabled");
                }}
                trailing={
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm" style={{ color: t.textSecondary }}>
                      {isDark ? "On" : "Off"}
                    </Text>
                    <Iconify icon="mdi:chevron-right" size={16} color={t.iconMuted} />
                  </View>
                }
              />
            </View>
          </View>

          {/* Security Section */}
          <View className="mx-5 mb-6">
            <Text className="text-xs font-bold mb-3 px-2 tracking-wider" style={{ color: t.textSecondary }}>
              SECURITY
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: t.surface,
                borderWidth: 1,
                borderColor: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              }}
            >
              <SettingsItem
                icon={<Iconify icon="mdi:shield-outline" size={20} color={t.textSecondary} />}
                label="Privacy & Security"
                colors={t}
                onPress={() => toast("Privacy settings coming soon")}
              />
              <View className="h-px mx-4" style={{ backgroundColor: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
              <SettingsItem
                icon={<Iconify icon="mdi:help-circle-outline" size={20} color={t.textSecondary} />}
                label="Help & Support"
                colors={t}
                onPress={() => toast("Help & Support coming soon")}
              />
            </View>
          </View>

          {/* Log Out */}
          <View className="mx-5">
            <Pressable
              onPress={handleLogout}
              className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? "rgba(255, 100, 103, 0.15)"
                  : "rgba(255, 100, 103, 0.08)",
              })}
            >
              <Iconify icon="mdi:logout" size={18} color="#FF6467" />
              <Text className="text-base font-medium text-[#FF6467]">
                Log Out
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
