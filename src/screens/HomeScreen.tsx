import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { FoodFormCard, type FoodFormValue } from '../features/foods/components/FoodFormCard';
import { FoodListCard } from '../features/foods/components/FoodListCard';
import { createFood, deleteFood, loadFoods } from '../features/foods/storage';
import type { FoodItem } from '../features/foods/types';
import { sortFoodsByExpiry } from '../features/foods/utils/expiry';

const INITIAL_FORM: FoodFormValue = {
  name: '',
  expiryDate: '',
};

export function HomeScreen() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [form, setForm] = useState<FoodFormValue>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateFoods() {
      try {
        const storedFoods = await loadFoods();
        if (isMounted) {
          setFoods(sortFoodsByExpiry(storedFoods));
        }
      } catch (error) {
        if (isMounted) {
          Alert.alert('데이터 로드 실패', error instanceof Error ? error.message : '식재료를 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void hydrateFoods();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleAddFood() {
    const name = form.name.trim();
    const expiryDate = form.expiryDate.trim();

    if (!name || !expiryDate) {
      Alert.alert('입력 필요', '식재료명과 유통기한을 입력해 주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const createdFood = await createFood({ name, expiryDate });
      setFoods((currentFoods) => sortFoodsByExpiry([createdFood, ...currentFoods]));
      setForm(INITIAL_FORM);
    } catch (error) {
      Alert.alert('저장 실패', error instanceof Error ? error.message : '식재료를 저장하지 못했습니다.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteFood(foodId: string) {
    try {
      const nextFoods = await deleteFood(foodId);
      setFoods(sortFoodsByExpiry(nextFoods));
    } catch (error) {
      Alert.alert('삭제 실패', error instanceof Error ? error.message : '식재료를 삭제하지 못했습니다.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Fridge Manager</Text>
          <Text style={styles.subtitle}>식재료를 추가하고 유통기한 순서로 확인하세요.</Text>
        </View>

        <FoodFormCard
          value={form}
          isSaving={isSaving}
          onChange={setForm}
          onSubmit={() => void handleAddFood()}
        />

        <FoodListCard foods={foods} isLoading={isLoading} onDeleteFood={(foodId) => void handleDeleteFood(foodId)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedText,
  },
});
