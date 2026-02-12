import React from "react";
import { View, Text, Pressable, type PressableProps, type ViewStyle, type TextStyle } from "react-native";
import { cn } from "../utils/cn";

export interface TransactionItemProps extends Omit<PressableProps, "children"> {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  amount: number;
  currency?: string;
  type: "credit" | "debit";
  className?: string;
  /** Override colors for light / dark theme support */
  colors?: {
    bg?: string;
    bgPressed?: string;
    iconBg?: string;
    title?: string;
    subtitle?: string;
    amount?: string;
  };
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

export function TransactionItem({
  icon,
  title,
  subtitle,
  amount,
  currency = "PHP",
  type,
  className,
  colors,
  ...props
}: TransactionItemProps) {
  const titleColor = colors?.title ?? "#FFFFFF";
  const subtitleColor = colors?.subtitle ?? "#6A7282";
  const amountColor = type === "credit" ? "#9FE870" : (colors?.amount ?? "#FFFFFF");
  const iconBg = colors?.iconBg ?? "#2C2C2E";

  return (
    <Pressable
      className={cn("flex-row items-center gap-3 px-4 py-3", className)}
      style={({ pressed }) => ({
        backgroundColor: pressed
          ? (colors?.bgPressed ?? "rgba(255,255,255,0.05)")
          : (colors?.bg ?? "transparent"),
      } as ViewStyle)}
      {...props}
    >
      {icon && (
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </View>
      )}

      <View className="flex-1 gap-0.5">
        <Text className="text-base font-medium" style={{ color: titleColor }}>{title}</Text>
        {subtitle && (
          <Text className="text-sm" style={{ color: subtitleColor }}>{subtitle}</Text>
        )}
      </View>

      <Text
        className="text-base font-semibold"
        style={{ color: amountColor, fontVariant: ["tabular-nums"] } as TextStyle}
        selectable
      >
        {type === "credit" ? "+" : "-"}
        {formatAmount(amount, currency)}
      </Text>
    </Pressable>
  );
}
