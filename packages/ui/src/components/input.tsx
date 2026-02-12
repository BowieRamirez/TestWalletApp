import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  type TextInputProps,
} from "react-native";
import { cn } from "../utils/cn";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  /** Override colors for theme support */
  colors?: {
    bg?: string;
    border?: string;
    borderFocused?: string;
    label?: string;
    text?: string;
    placeholder?: string;
  };
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  colors,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const bgColor = colors?.bg ?? "#1C1C1E";
  const borderColor = isFocused
    ? (colors?.borderFocused ?? "#9FE870")
    : error
      ? "#EF4444"
      : (colors?.border ?? "rgba(255,255,255,0.1)");
  const labelColor = colors?.label ?? "#D1D5DC";
  const textColor = colors?.text ?? "#FFFFFF";
  const placeholderColor = colors?.placeholder ?? "#6A7282";

  return (
    <View className={cn("gap-1.5", containerClassName)}>
      {label && (
        <Text className="text-sm font-medium" style={{ color: labelColor }}>{label}</Text>
      )}
      <View
        className="flex-row items-center rounded-2xl px-4"
        style={{
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor,
        }}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          className={cn("flex-1 py-3.5 text-base", className)}
          style={{ color: textColor }}
          placeholderTextColor={placeholderColor}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-sm text-red-500">{error}</Text>
      )}
      {hint && !error && (
        <Text className="text-sm text-neutral-400">{hint}</Text>
      )}
    </View>
  );
}
