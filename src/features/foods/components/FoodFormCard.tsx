import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../../constants/colors';

export interface FoodFormValue {
  name: string;
  expiryDate: string;
}

interface FoodFormCardProps {
  value: FoodFormValue;
  isSaving: boolean;
  onChange: (nextValue: FoodFormValue) => void;
  onSubmit: () => void;
}

export function FoodFormCard({ value, isSaving, onChange, onSubmit }: FoodFormCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>식재료 등록</Text>
      <TextInput
        placeholder="예: 우유"
        placeholderTextColor={colors.mutedText}
        style={styles.input}
        value={value.name}
        onChangeText={(name) => onChange({ ...value, name })}
      />
      <TextInput
        placeholder="유통기한 YYYY-MM-DD"
        placeholderTextColor={colors.mutedText}
        style={styles.input}
        value={value.expiryDate}
        onChangeText={(expiryDate) => onChange({ ...value, expiryDate })}
        autoCapitalize="none"
      />
      <Pressable
        accessibilityRole="button"
        disabled={isSaving}
        onPress={onSubmit}
        style={[styles.primaryButton, isSaving && styles.primaryButtonDisabled]}
      >
        <Text style={styles.primaryButtonLabel}>{isSaving ? '저장 중...' : '추가하기'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.accentStrong,
    paddingVertical: 14,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
