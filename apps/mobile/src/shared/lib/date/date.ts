/**
 * Date Utilities
 *
 * Helpers for formatting, parsing, and working with dates
 * Optimized for banking transaction displays
 */

import { Platform } from 'react-native';

/**
 * Default locale for date formatting
 */
const DEFAULT_LOCALE = 'en-US';

/**
 * Format a date for transaction display
 * Shows time for today, day name for this week, date otherwise
 *
 * @param date - Date to format (Date object or ISO string)
 * @returns Formatted date string
 *
 * @example
 * formatTransactionDate(new Date()) // 'Today, 2:30 PM'
 * formatTransactionDate(yesterday) // 'Yesterday, 2:30 PM'
 * formatTransactionDate(thisWeek) // 'Monday, 2:30 PM'
 * formatTransactionDate(older) // 'Jan 15, 2024'
 */
export function formatTransactionDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISODate(date) : date;

  if (!isValidDate(dateObj)) {
    return 'Invalid date';
  }

  const now = new Date();
  const isSameDay = dateObj.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = dateObj.toDateString() === yesterday.toDateString();

  // Format time
  const timeFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const timeStr = timeFormatter.format(dateObj);

  if (isSameDay) {
    return `Today, ${timeStr}`;
  }

  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }

  // Check if within last 7 days
  const daysDiff = Math.floor(
    (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff < 7) {
    const dayFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      weekday: 'long',
    });
    return `${dayFormatter.format(dateObj)}, ${timeStr}`;
  }

  // Older dates
  const dateFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Include year only if different from current year
  if (dateObj.getFullYear() !== now.getFullYear()) {
    return dateFormatter.format(dateObj);
  }

  const shortFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    month: 'short',
    day: 'numeric',
  });
  return shortFormatter.format(dateObj);
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "3 days ago")
 *
 * @param date - Date to format (Date object or ISO string)
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime(new Date()) // 'just now'
 * formatRelativeTime(2 hours ago) // '2 hours ago'
 * formatRelativeTime(3 days ago) // '3 days ago'
 * formatRelativeTime(2 weeks ago) // '2 weeks ago'
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISODate(date) : date;

  if (!isValidDate(dateObj)) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Future dates
  if (diffMs < 0) {
    const absSecs = Math.abs(diffSecs);
    const absMins = Math.abs(diffMins);
    const absHours = Math.abs(diffHours);
    const absDays = Math.abs(diffDays);

    if (absSecs < 60) return 'in a moment';
    if (absMins === 1) return 'in 1 minute';
    if (absMins < 60) return `in ${absMins} minutes`;
    if (absHours === 1) return 'in 1 hour';
    if (absHours < 24) return `in ${absHours} hours`;
    if (absDays === 1) return 'tomorrow';
    return `in ${absDays} days`;
  }

  // Past dates
  if (diffSecs < 10) return 'just now';
  if (diffSecs < 60) return `${diffSecs} seconds ago`;
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  if (diffYears === 1) return '1 year ago';
  return `${diffYears} years ago`;
}

/**
 * Parse an ISO date string to a Date object
 *
 * @param dateString - ISO 8601 date string
 * @returns Date object
 * @throws Error if the date string is invalid
 *
 * @example
 * parseISODate('2024-01-15T14:30:00.000Z')
 */
export function parseISODate(dateString: string): Date {
  if (!dateString) {
    throw new Error('Date string is required');
  }

  const date = new Date(dateString);

  if (!isValidDate(date)) {
    throw new Error(`Invalid ISO date string: ${dateString}`);
  }

  return date;
}

/**
 * Check if a date is today
 *
 * @param date - Date to check
 * @returns True if the date is today
 */
export function isToday(date: Date): boolean {
  if (!isValidDate(date)) return false;

  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if a date is within this week (Sunday to Saturday)
 *
 * @param date - Date to check
 * @returns True if the date is in the current week
 */
export function isThisWeek(date: Date): boolean {
  if (!isValidDate(date)) return false;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
}

/**
 * Check if a date is within this month
 *
 * @param date - Date to check
 * @returns True if the date is in the current month
 */
export function isThisMonth(date: Date): boolean {
  if (!isValidDate(date)) return false;

  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 * Check if a value is a valid Date object
 *
 * @param date - Value to check
 * @returns True if valid Date
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Format a date for display in statements
 *
 * @param date - Date to format
 * @param includeTime - Whether to include time
 * @returns Formatted date string
 */
export function formatStatementDate(
  date: Date | string,
  includeTime: boolean = false
): string {
  const dateObj = typeof date === 'string' ? parseISODate(date) : date;

  if (!isValidDate(dateObj)) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = 'numeric';
    options.minute = '2-digit';
    options.hour12 = true;
  }

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(dateObj);
}

/**
 * Get start and end dates for a date range
 *
 * @param range - Range type
 * @returns Object with start and end dates
 */
export function getDateRange(range: 'today' | 'week' | 'month' | 'year'): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
}

/**
 * Format a date for API requests (ISO 8601)
 *
 * @param date - Date to format
 * @returns ISO 8601 string
 */
export function toISODate(date: Date): string {
  if (!isValidDate(date)) {
    throw new Error('Invalid date');
  }
  return date.toISOString();
}

/**
 * Add days to a date
 *
 * @param date - Base date
 * @param days - Number of days to add (negative to subtract)
 * @returns New Date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get the age of a date in days
 *
 * @param date - Date to check
 * @returns Number of days since the date
 */
export function getAgeInDays(date: Date | string): number {
  const dateObj = typeof date === 'string' ? parseISODate(date) : date;

  if (!isValidDate(dateObj)) {
    return 0;
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
