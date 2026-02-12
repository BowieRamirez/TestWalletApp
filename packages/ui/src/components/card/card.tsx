import React from 'react';
import {
  View,
  StyleSheet,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/tokens';

export type CardElevation = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps extends ViewProps {
  /** Card content */
  children: React.ReactNode;
  /** Shadow elevation level */
  elevation?: CardElevation;
  /** Custom container style */
  style?: ViewStyle;
  /** Whether the card has padding */
  padded?: boolean;
  /** Whether the card has a border */
  bordered?: boolean;
  /** Border radius variant */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Card Component
 *
 * A container component with banking-appropriate styling.
 * Provides consistent elevation, borders, and padding.
 *
 * @example
 * ```tsx
 * <Card elevation="md" padded>
 *   <Text>Card content here</Text>
 * </Card>
 *
 * <Card elevation="lg" bordered radius="lg">
 *   <Text>Important information</Text>
 * </Card>
 *
 * <Card elevation="none" style={{ backgroundColor: '#f0f0f0' }}>
 *   <Text>Custom styled card</Text>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'none',
  style,
  padded = true,
  bordered = false,
  radius = 'md',
  ...viewProps
}) => {
  const getElevationStyles = (): ViewStyle => {
    switch (elevation) {
      case 'none':
        return shadows.none;
      case 'sm':
        return shadows.sm;
      case 'md':
        return shadows.md;
      case 'lg':
        return shadows.lg;
      case 'xl':
        return shadows.xl;
      default:
        return shadows.none;
    }
  };

  const getRadiusStyles = (): ViewStyle => {
    switch (radius) {
      case 'none':
        return { borderRadius: borderRadius.none };
      case 'sm':
        return { borderRadius: borderRadius.sm };
      case 'md':
        return { borderRadius: borderRadius.md };
      case 'lg':
        return { borderRadius: borderRadius.lg };
      case 'xl':
        return { borderRadius: borderRadius.xl };
      default:
        return { borderRadius: borderRadius.md };
    }
  };

  return (
    <View
      style={[
        styles.base,
        getElevationStyles(),
        getRadiusStyles(),
        padded && styles.padded,
        bordered && styles.bordered,
        style,
      ]}
      {...viewProps}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.md,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default Card;
