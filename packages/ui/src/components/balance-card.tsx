import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { cn } from "../utils/cn";
import { Card } from "./card";

export interface BalanceCardProps {
  title: string;
  balance: number;
  currency?: string;
  accountNumber?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  return `••••${accountNumber.slice(-4)}`;
}

export function BalanceCard({
  title,
  balance,
  currency = "PHP",
  accountNumber,
  variant = "primary",
  className,
}: BalanceCardProps) {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <Card
      variant="elevated"
      padding="lg"
      className={cn(
        variant === "primary" ? "bg-[#9FE870]" : "bg-[#1C1C1E]",
        className
      )}
    >
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text
            className={cn(
              "text-sm font-medium",
              variant === "primary" ? "text-black/60" : "text-[#6A7282]"
            )}
          >
            {title}
          </Text>
          <Pressable
            onPress={() => setIsHidden(!isHidden)}
            hitSlop={8}
          >
            <Text
              className={cn(
                "text-sm",
                variant === "primary" ? "text-black/50" : "text-[#6A7282]"
              )}
            >
              {isHidden ? "Show" : "Hide"}
            </Text>
          </Pressable>
        </View>

        <Text
          className={cn(
            "text-3xl font-bold",
            variant === "primary" ? "text-black" : "text-white"
          )}
          style={{ fontVariant: ["tabular-nums"] }}
          selectable
        >
          {isHidden ? "••••••" : formatCurrency(balance, currency)}
        </Text>

        {accountNumber && (
          <Text
            className={cn(
              "text-sm",
              variant === "primary" ? "text-black/50" : "text-[#6A7282]"
            )}
            selectable
          >
            {maskAccountNumber(accountNumber)}
          </Text>
        )}
      </View>
    </Card>
  );
}
