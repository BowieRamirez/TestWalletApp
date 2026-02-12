import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'activeOpacity'> {
  /** Button text content */
  title: string;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Loading state - shows spinner */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * Button Component
 *
 * A versatile button component with banking-appropriate styling.
 * Supports multiple variants, sizes, and states.
 *
 * @example
 * ```tsx
 * <Button title="Transfer Funds" onPress={handleTransfer} variant="primary" />
 * <Button title="Cancel" onPress={handleCancel} variant="outline" />
 * <Button title="Delete" onPress={handleDelete} variant="danger" />
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  textStyle,
  style,
  ...touchableProps
}) => {
  const isDisabled = disabled || loading;

  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...sizeStyles[size],
      ...(isDisabled && styles.disabled),
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, ...styles.primary };
      case 'secondary':
        return { ...baseStyle, ...styles.secondary };
      case 'outline':
        return { ...baseStyle, ...styles.outline };
      case 'danger':
        return { ...baseStyle, ...styles.danger };
      default:
        return baseStyle;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.textBase,
      ...textSizeStyles[size],
    };

    if (isDisabled) {
      return { ...baseTextStyle, ...styles.textDisabled };
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return { ...baseTextStyle, ...styles.textFilled };
      case 'outline':
        return { ...baseTextStyle, ...styles.textOutline };
      default:
        return baseTextStyle;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...touchableProps}
      style={[getContainerStyles(), style]}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' ? colors.primary[500] : colors.neutral[0]}
            style={styles.spinner}
          />
        ) : null}
        <Text style={[getTextStyles(), textStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.secondary[500],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary[500],
  },
  danger: {
    backgroundColor: colors.error[500],
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  textFilled: {
    color: colors.neutral[0],
  },
  textOutline: {
    color: colors.primary[500],
  },
  textDisabled: {
    color: colors.neutral[400],
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
};

const textSizeStyles: Record<ButtonSize, TextStyle> = {
  sm: {
    fontSize: typography.fontSize.sm,
  },
  md: {
    fontSize: typography.fontSize.md,
  },
  lg: {
    fontSize: typography.fontSize.lg,
  },
};

export default Button;
