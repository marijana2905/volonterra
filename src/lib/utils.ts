import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ActionStatus } from '@prisma/types';
import { ActionStatusExtended } from '@/types/action.type';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function blobToBase64(blobOrUrl: Blob | string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      let blob: Blob;

      if (typeof blobOrUrl === 'string') {
        // If it's a blob URL, fetch the blob first
        const response = await fetch(blobOrUrl);
        blob = await response.blob();
      } else {
        blob = blobOrUrl;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    } catch (error) {
      reject(error);
    }
  });
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Date utility functions
export function mergeDateAndTime(date: Date, time: string): Date {
  const [hour, minute] = time.split(':').map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
}

export function formatDate(date: Date) {
  // Prikaz u srpskoj vremenskoj zoni (Europe/Belgrade)
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Belgrade',
  };

  const formatted = new Intl.DateTimeFormat('sr-Latn', options).format(date);

  return formatted.replace(',', '');
}

export function formatDateTime(date: Date) {
  // Prikaz u srpskoj vremenskoj zoni (Europe/Belgrade)
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Belgrade',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Belgrade',
  };

  const formattedDate = new Intl.DateTimeFormat('sr-Latn', dateOptions).format(date);
  const formattedTime = new Intl.DateTimeFormat('sr-Latn', timeOptions).format(date);

  return `${formattedDate.replace(',', '')} (${formattedTime})`;
}

export function getTimeFromDateTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function isSameDate(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export const getTimeFromDate = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `pre ${seconds} sekundi`;
  if (minutes < 60) return `pre ${minutes} ${pluralize(minutes, 'minut', 'minuta', 'minuta')}`;
  if (hours < 24) return `pre ${hours} ${pluralize(hours, 'sat', 'sata', 'sati')}`;
  if (days < 7) return `pre ${days} ${pluralize(days, 'dan', 'dana', 'dana')}`;
  if (weeks < 5) return `pre ${weeks} ${pluralize(weeks, 'nedelju', 'nedelje', 'nedelja')}`;
  if (months < 12) return `pre ${months} ${pluralize(months, 'mesec', 'meseca', 'meseci')}`;
  return `pre ${years} ${pluralize(years, 'godinu', 'godine', 'godina')}`;
}

export function formatMonthLabel(value: string) {
  return new Date(value).toLocaleDateString('sr-Latn-RS', {
    month: 'short',
    year: 'numeric',
  });
}

// Funkcija za ispravno srpsko množenje (singular, paušalno dual, plural)
function pluralize(n: number, one: string, few: string, many: string): string {
  if (n % 10 === 1 && n % 100 !== 11) return one;
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return few;
  return many;
}

// Action live status utility functions
export function isApprovalNeeded(fullDateTo: Date, status: ActionStatus): boolean {
  const now = new Date();
  return now > fullDateTo && status === ActionStatus.CREATED;
}

export function isCurrentlyActiveAction(
  fullDateFrom: Date,
  fullDateTo: Date,
  status: ActionStatus,
) {
  const now = new Date();
  return now >= fullDateFrom && now <= fullDateTo && status === ActionStatus.CREATED;
}

export function canEditAction(fullDateFrom: Date, status?: ActionStatus): boolean {
  if (status === undefined) return false;

  const now = new Date();
  return (
    status !== ActionStatus.CANCELLED &&
    fullDateFrom.getTime() - now.getTime() >= 2 * 24 * 60 * 60 * 1000
  );
}

// get ActionStatusExtended
export function getActionStatusExtended(
  fullDateFrom: Date,
  fullDateTo: Date,
  status: ActionStatus,
): ActionStatusExtended {
  if (isApprovalNeeded(fullDateTo, status)) {
    return 'APPROVAL_NEEDED';
  }

  if (isCurrentlyActiveAction(fullDateFrom, fullDateTo, status)) {
    return 'ONGOING';
  }

  if (status == ActionStatus.CANCELLED) {
    return 'CANCELLED';
  }

  if (status == ActionStatus.COMPLETED) {
    return 'COMPLETED';
  }

  if (status === ActionStatus.CREATED && fullDateFrom > new Date()) {
    return 'UPCOMING';
  }

  return 'ALL';
}

// Ovo je bedz za javnu stranicu akcije
export const getStatusBadge = (
  status: ActionStatus,
  fullDateFrom: Date,
  fullDateTo: Date,
): {
  variant: 'upcoming' | 'default' | 'completed' | 'destructive';
  children: string;
} => {
  // UPCOMING: Action is upcoming
  if (status === ActionStatus.CREATED && fullDateFrom > new Date()) {
    return {
      variant: 'upcoming',
      children: 'Nadolazeća',
    };
  }

  // ONGOING: Action is currently active
  if (status === ActionStatus.CREATED && fullDateFrom <= new Date() && fullDateTo >= new Date()) {
    return {
      variant: 'default',
      children: 'U toku',
    };
  }

  // COMPLETED: Action is completed
  if (status === ActionStatus.COMPLETED) {
    return {
      variant: 'completed',
      children: 'Završena',
    };
  }

  // CANCELLED: Action is cancelled
  if (status === ActionStatus.CANCELLED) {
    return {
      variant: 'destructive',
      children: 'Otkazana',
    };
  }

  // DEFAULT: Fallback for any other status
  return {
    variant: 'default',
    children: 'Nedefinisana',
  };
};

export const badgeRules = [0, 5, 10, 15, 20, 50];

export const badgeNames = [
  'Bedž Dobrodošlice',
  'Junior Volonter',
  'Eko Pionir',
  'Zeleni Saveznik',
  'Zeleni Lider',
  'Eko Ambasador',
];
