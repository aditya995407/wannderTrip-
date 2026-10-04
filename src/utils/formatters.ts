import { ActivityCategory, ActivityPriority, ActivityStatus } from '../types/trip';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  SGD: 'S$',
};

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency + ' ';
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

export function formatDateDisplay(dateString: string): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateRange(start: string, end: string): string {
  if (!start) return '';
  const s = formatDateDisplay(start);
  if (!end || end === start) return s;
  const e = formatDateDisplay(end);
  return `${s} – ${e}`;
}

export interface CategoryMeta {
  label: string;
  dotColor: string;
  textColor: string;
  bgColor: string;
}

export const CATEGORY_DETAILS: Record<ActivityCategory, CategoryMeta> = {
  sightseeing: {
    label: 'Sightseeing',
    dotColor: 'bg-indigo-500',
    textColor: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
  },
  dining: {
    label: 'Dining & Drinks',
    dotColor: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
  transport: {
    label: 'Transport',
    dotColor: 'bg-sky-500',
    textColor: 'text-sky-700',
    bgColor: 'bg-sky-50',
  },
  stay: {
    label: 'Accommodation',
    dotColor: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  outdoor: {
    label: 'Outdoor & Nature',
    dotColor: 'bg-teal-500',
    textColor: 'text-teal-700',
    bgColor: 'bg-teal-50',
  },
  culture: {
    label: 'Culture & Art',
    dotColor: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  shopping: {
    label: 'Shopping',
    dotColor: 'bg-rose-500',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-50',
  },
  relaxation: {
    label: 'Wellness & Leisure',
    dotColor: 'bg-cyan-500',
    textColor: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
  },
};

export const PRIORITY_DETAILS: Record<ActivityPriority, { label: string; textClass: string }> = {
  'must-do': {
    label: 'Must-visit',
    textClass: 'text-rose-600 font-semibold',
  },
  recommended: {
    label: 'Recommended',
    textClass: 'text-blue-600 font-medium',
  },
  optional: {
    label: 'Optional',
    textClass: 'text-slate-500 font-normal',
  },
};

export const STATUS_DETAILS: Record<ActivityStatus, { label: string; indicator: string }> = {
  planned: {
    label: 'Planned',
    indicator: 'text-slate-600',
  },
  booked: {
    label: 'Confirmed / Booked',
    indicator: 'text-emerald-600 font-medium',
  },
  completed: {
    label: 'Completed',
    indicator: 'text-slate-400 line-through',
  },
};
