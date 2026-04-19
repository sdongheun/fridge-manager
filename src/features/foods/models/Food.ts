import dayjs from 'dayjs';

import type { FoodItem, FoodStatus } from '../types';

export class Food {
  constructor(private readonly item: FoodItem) {}

  static fromItem(item: FoodItem) {
    return new Food(item);
  }

  static sortItems(foods: FoodItem[]) {
    return [...foods].sort((left, right) => Food.fromItem(left).compareExpiry(right));
  }

  get snapshot() {
    return this.item;
  }

  get daysUntilExpiry() {
    return dayjs(this.item.expiryDate).startOf('day').diff(dayjs().startOf('day'), 'day');
  }

  get status(): FoodStatus {
    if (this.daysUntilExpiry <= 0) {
      return 'expired';
    }

    if (this.daysUntilExpiry <= 3) {
      return 'soon';
    }

    return 'fresh';
  }

  get statusLabel() {
    switch (this.status) {
      case 'fresh':
        return 'Fresh';
      case 'soon':
        return 'Soon';
      case 'expired':
        return 'Expired';
    }
  }

  get expiryCountdownLabel() {
    if (this.daysUntilExpiry < 0) {
      return `${Math.abs(this.daysUntilExpiry)}일 지남`;
    }

    if (this.daysUntilExpiry === 0) {
      return '오늘 만료';
    }

    return `${this.daysUntilExpiry}일 남음`;
  }

  compareExpiry(other: FoodItem) {
    return this.daysUntilExpiry - Food.fromItem(other).daysUntilExpiry;
  }
}
