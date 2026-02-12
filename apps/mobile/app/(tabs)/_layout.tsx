import React from "react";
import { View, Pressable, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Iconify } from "react-native-iconify";
import { useThemeColors } from "@/hooks/use-theme-colors";

const TAB_ICONS = [
  "mdi:home",
  "mdi:credit-card",
  "mdi:chart-pie",
  "mdi:cog",
] as const;

function CustomTabBar({ state, descriptors, navigation }: any) {
  const t = useThemeColors();

  return (
    <View
      style={{
        position: "absolute",
        bottom: Platform.OS === "ios" ? 30 : 20,
        left: 24,
        right: 24,
        height: 64,
        borderRadius: 32,
        backgroundColor: t.tabBarBg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: t.tabBarBorder,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            hitSlop={8}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isFocused ? "#9FE870" : "transparent",
            }}
          >
            <Iconify
              icon={TAB_ICONS[index]}
              size={22}
              color={isFocused ? "#000000" : t.iconMuted}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="(accounts)" />
      <Tabs.Screen name="(transfers)" />
      <Tabs.Screen name="(settings)" />
    </Tabs>
  );
}
