import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Input label */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom input style */
  inputStyle?: TextStyle;
  /** Custom label style */
  labelStyle?: TextStyle;
  /** Custom error style */
  errorStyle?: TextStyle;
  /** Left icon component */
  leftIcon?: React.ReactNode;
  /** Right icon component */
  rightIcon?: React.ReactNode;
  /** Whether the input is in an error state */
  hasError?: boolean;
}

/**
 * Input Component
 *
 * A text input component with banking-appropriate styling.
 * Supports labels, error states, icons, and secure text entry.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Account Number"
 *   value={accountNumber}
 *   onChangeText={setAccountNumber}
 *   placeholder="Enter account number"
 * />
 *
 * <Input
 *   label="PIN"
 *   value={pin}
 *   onChangeText={setPin}
 *   secureTextEntry
 *   maxLength={4}
 *   keyboardType="numeric"
 * />
 *
 * <Input
 *   label="Amount"
 *   value={amount}
 *   onChangeText={setAmount}
 *   error={amountError}
 *   keyboardType="decimal-pad"
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  hasError,
  editable = true,
  secureTextEntry,
  placeholder,
  ...textInputProps
}) => {
  const isError = hasError || !!error;
  const isDisabled = editable === false;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, isDisabled && styles.labelDisabled, labelStyle]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          isError && styles.inputContainerError,
          isDisabled && styles.inputContainerDisabled,
          leftIcon && styles.inputContainerWithLeftIcon,
          rightIcon && styles.inputContainerWithRightIcon,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            isError && styles.inputError,
            isDisabled && styles.inputDisabled,
            inputStyle,
          ]}
          placeholderTextColor={colors.text.tertiary}
          editable={editable}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          accessibilityLabel={label}
          accessibilityState={{ disabled: isDisabled }}
          {...textInputProps}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && (
        <Text style={[styles.errorText, errorStyle]} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  labelDisabled: {
    color: colors.text.tertiary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    minHeight: 48,
  },
  inputContainerError: {
    borderColor: colors.error[500],
    backgroundColor: colors.error[50],
  },
  inputContainerDisabled: {
    backgroundColor: colors.neutral[100],
    borderColor: colors.neutral[200],
  },
  inputContainerWithLeftIcon: {
    paddingLeft: spacing.md,
  },
  inputContainerWithRightIcon: {
    paddingRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  inputError: {
    color: colors.error[700],
  },
  inputDisabled: {
    color: colors.text.tertiary,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error[500],
    marginTop: spacing.xs,
  },
});

export default Input;
