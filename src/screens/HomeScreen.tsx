import { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { signOut } from '../features/auth/service';
import type { AuthUser } from '../features/auth/types';
import { FoodFormCard, type FoodFormValue } from '../features/foods/components/FoodFormCard';
import { FoodListCard } from '../features/foods/components/FoodListCard';
import { Food } from '../features/foods/models/Food';
import { createFood, deleteFood, loadFoods } from '../features/foods/service';
import type { FoodItem } from '../features/foods/types';

const INITIAL_FORM: FoodFormValue = {
  name: '',
  expiryDate: '',
};

interface HomeScreenProps {
  currentUser: AuthUser;
  onSignedOut: () => void;
}

export function HomeScreen({ currentUser, onSignedOut }: HomeScreenProps) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [form, setForm] = useState<FoodFormValue>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateFoods() {
      try {
        const storedFoods = await loadFoods();
        if (isMounted) {
          setFoods(Food.sortItems(storedFoods));
        }
      } catch (error) {
        if (isMounted) {
          Alert.alert(
            '데이터 로드 실패',
            error instanceof Error ? error.message : '식재료를 불러오지 못했습니다.',
          );
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
  }, [currentUser.id]);

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
      setFoods((currentFoods) => Food.sortItems([createdFood, ...currentFoods]));
      setForm(INITIAL_FORM);
    } catch (error) {
      Alert.alert(
        '저장 실패',
        error instanceof Error ? error.message : '식재료를 저장하지 못했습니다.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteFood(foodId: string) {
    try {
      const nextFoods = await deleteFood(foodId);
      setFoods(Food.sortItems(nextFoods));
    } catch (error) {
      Alert.alert(
        '삭제 실패',
        error instanceof Error ? error.message : '식재료를 삭제하지 못했습니다.',
      );
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut();
      onSignedOut();
    } catch (error) {
      Alert.alert(
        '로그아웃 실패',
        error instanceof Error ? error.message : '로그아웃을 완료하지 못했습니다.',
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Fridge Manager</Text>
            <Text style={styles.subtitle}>
              {currentUser.displayName ?? currentUser.email ?? '사용자'} 님의 냉장고입니다.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={isSigningOut}
            onPress={() => void handleSignOut()}
            style={[styles.signOutButton, isSigningOut && styles.signOutButtonDisabled]}
          >
            <Text style={styles.signOutButtonLabel}>
              {isSigningOut ? '로그아웃 중...' : '로그아웃'}
            </Text>
          </Pressable>
        </View>

        <FoodFormCard
          value={form}
          isSaving={isSaving}
          onChange={setForm}
          onSubmit={() => void handleAddFood()}
        />

        <FoodListCard
          foods={foods}
          isLoading={isLoading}
          onDeleteFood={(foodId) => void handleDeleteFood(foodId)}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
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
  signOutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.dangerSoft,
  },
  signOutButtonDisabled: {
    opacity: 0.7,
  },
  signOutButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
});
