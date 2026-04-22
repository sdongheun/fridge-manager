import { AuthSessionRepository } from '../auth/session';
import { FoodRepository } from './repository';
import type { FoodItem, FoodItemWriteInput } from './types';

export interface CreateFoodInput {
  name: string;
  expiryDate: string;
}

export class FoodService {
  constructor(
    private readonly authSessionRepository: AuthSessionRepository,
    private readonly foodRepository: FoodRepository,
  ) {}

  async loadFoods() {
    const currentUser = await this.authSessionRepository.getCurrentUser();

    if (!currentUser) {
      return [];
    }

    // Legacy migration-based fridge flow is disabled because the live DB has no fridges table.
    // const fridge = await this.fridgeRepository.getOwnedFridgeByUserId(currentUser.id);
    // return this.foodRepository.listByFridge(currentUser.id, fridge.id);
    return this.foodRepository.listByUser(currentUser.id);
  }

  async createFood(input: CreateFoodInput) {
    const currentUser = await this.authSessionRepository.requireCurrentUser();

    const nextInput: FoodItemWriteInput = {
      // Legacy migration-based fridge linkage is disabled because the live DB has no fridges table.
      name: input.name.trim(),
      expiryDate: input.expiryDate,
    };

    return this.foodRepository.create(currentUser.id, nextInput);
  }

  async deleteFood(foodId: string) {
    const currentUser = await this.authSessionRepository.requireCurrentUser();
    await this.foodRepository.delete(currentUser.id, foodId);
    return this.loadFoods();
  }
}

const authSessionRepository = new AuthSessionRepository();
const foodRepository = new FoodRepository();

export const foodService = new FoodService(
  authSessionRepository,
  foodRepository,
);

export async function loadFoods() {
  return foodService.loadFoods();
}

export async function createFood(input: CreateFoodInput) {
  return foodService.createFood(input);
}

export async function deleteFood(foodId: string): Promise<FoodItem[]> {
  return foodService.deleteFood(foodId);
}
