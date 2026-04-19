import dayjs from 'dayjs';

import type { FoodItem, FoodStatus } from '../types';

export function getDaysUntilExpiry(expiryDate: string) {
  return dayjs(expiryDate).startOf('day').diff(dayjs().startOf('day'), 'day');
}

export function getFoodStatus(daysUntilExpiry: number): FoodStatus {
  if (daysUntilExpiry <= 0) {
    return 'expired';
  }

  if (daysUntilExpiry <= 3) {
    return 'soon';
  }

  return 'fresh';
}

export function getFoodStatusLabel(status: FoodStatus) {
  switch (status) {
    case 'fresh':
      return 'Fresh';
    case 'soon':
      return 'Soon';
    case 'expired':
      return 'Expired';
  }
}

export function sortFoodsByExpiry<T extends Pick<FoodItem, 'expiryDate'>>(foods: T[]) {
  return [...foods].sort(
    (left, right) => getDaysUntilExpiry(left.expiryDate) - getDaysUntilExpiry(right.expiryDate),
  );
}
