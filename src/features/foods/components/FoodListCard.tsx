import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../constants/colors';
import type { FoodItem } from '../types';
import { getDaysUntilExpiry, getFoodStatus, getFoodStatusLabel } from '../utils/expiry';
import { getExpiryCountdownLabel } from '../utils/presentation';

interface FoodListCardProps {
  foods: FoodItem[];
  isLoading: boolean;
  onDeleteFood: (foodId: string) => void;
}

export function FoodListCard({ foods, isLoading, onDeleteFood }: FoodListCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>보관 중인 식재료</Text>
      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.accentStrong} />
        </View>
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id}
          contentContainerStyle={foods.length === 0 ? styles.emptyListContent : styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={styles.emptyTitle}>아직 등록된 식재료가 없습니다.</Text>
              <Text style={styles.emptyDescription}>위 폼에서 첫 식재료를 추가해 보세요.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
            const status = getFoodStatus(daysUntilExpiry);

            return (
              <View style={styles.foodRow}>
                <View style={styles.foodTextBlock}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodMeta}>
                    {item.expiryDate} · {getFoodStatusLabel(status)}
                  </Text>
                </View>
                <View style={styles.foodActions}>
                  <Text style={styles.foodDays}>{getExpiryCountdownLabel(daysUntilExpiry)}</Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onDeleteFood(item.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonLabel}>삭제</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceStrong,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 6,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listContent: {
    paddingTop: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.mutedText,
    textAlign: 'center',
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  foodTextBlock: {
    flex: 1,
    gap: 4,
  },
  foodName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  foodMeta: {
    fontSize: 14,
    color: colors.mutedText,
  },
  foodActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  foodDays: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.info,
  },
  deleteButton: {
    borderRadius: 10,
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteButtonLabel: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
});
