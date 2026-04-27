import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../constants/colors';
import { signIn, signUp } from '../features/auth/service';

type AuthMode = 'signin' | 'signup';

interface AuthScreenProps {
  onSignedIn: () => void;
}

interface AuthFormState {
  loginId: string;
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
}

const INITIAL_FORM: AuthFormState = {
  loginId: '',
  email: '',
  password: '',
  displayName: '',
  phoneNumber: '',
};

const authCopy = {
  signin: {
    title: '아이디로 로그인',
    description:
      '로그인은 이메일이 아니라 가입한 아이디를 사용합니다. 서버에서 아이디로 이메일을 조회한 뒤 로그인합니다.',
    submitLabel: '로그인',
  },
  signup: {
    title: '회원가입',
    description:
      '회원가입 시 아이디, 이메일, 이름, 전화번호, 비밀번호를 모두 저장합니다. 아이디는 이후 로그인 식별자로 사용됩니다.',
    submitLabel: '회원가입',
  },
} as const;

export function AuthScreen({ onSignedIn }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [form, setForm] = useState<AuthFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCopy = authCopy[mode];

  function handleModeChange(nextMode: AuthMode) {
    setMode(nextMode);
    setForm((current) => ({
      loginId: current.loginId,
      email: nextMode === 'signup' ? current.email : '',
      password: current.password,
      displayName: nextMode === 'signup' ? current.displayName : '',
      phoneNumber: nextMode === 'signup' ? current.phoneNumber : '',
    }));
  }

  async function handleSubmit() {
    const loginId = form.loginId.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const displayName = form.displayName.trim();
    const phoneNumber = form.phoneNumber.trim();

    if (!loginId || !password) {
      Alert.alert('입력 필요', '아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    if (mode === 'signup' && (!displayName || !email || !phoneNumber)) {
      Alert.alert('입력 필요', '회원가입에는 아이디, 이메일, 이름, 전화번호, 비밀번호가 필요합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const signedUpUser = await signUp({
          loginId,
          email,
          password,
          displayName,
          phoneNumber,
        });

        if (!signedUpUser) {
          Alert.alert(
            '이메일 확인 필요',
            '회원가입은 완료되었습니다. 이메일 인증 후 로그인해 주세요.',
          );
          setMode('signin');
          return;
        }
      } else {
        await signIn({ loginId, password });
      }

      onSignedIn();
    } catch (error) {
      const message = error instanceof Error ? error.message : '인증 처리 중 오류가 발생했습니다.';
      Alert.alert(mode === 'signup' ? '회원가입 실패' : '로그인 실패', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Fridge Manager</Text>
          <Text style={styles.title}>세션이 없으면 먼저 인증 화면으로 진입합니다.</Text>
          <Text style={styles.subtitle}>
            비로그인 상태에서는 메인 화면으로 넘어가지 않고, 로그인 또는 회원가입이 끝난 뒤에만
            냉장고 목록을 엽니다.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.segmentedRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => handleModeChange('signin')}
              style={[styles.segmentButton, mode === 'signin' && styles.segmentButtonActive]}
            >
              <Text
                style={[styles.segmentButtonText, mode === 'signin' && styles.segmentButtonTextActive]}
              >
                로그인
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => handleModeChange('signup')}
              style={[styles.segmentButton, mode === 'signup' && styles.segmentButtonActive]}
            >
              <Text
                style={[styles.segmentButtonText, mode === 'signup' && styles.segmentButtonTextActive]}
              >
                회원가입
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>{currentCopy.title}</Text>
          <Text style={styles.sectionDescription}>{currentCopy.description}</Text>

          {mode === 'signup' ? (
            <>
              <TextInput
                placeholder="로그인 아이디"
                placeholderTextColor={colors.mutedText}
                style={styles.input}
                autoCapitalize="none"
                value={form.loginId}
                onChangeText={(loginId) => setForm((current) => ({ ...current, loginId }))}
              />
              <TextInput
                placeholder="이메일 주소"
                placeholderTextColor={colors.mutedText}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(email) => setForm((current) => ({ ...current, email }))}
              />
              <TextInput
                placeholder="이름"
                placeholderTextColor={colors.mutedText}
                style={styles.input}
                value={form.displayName}
                onChangeText={(displayName) => setForm((current) => ({ ...current, displayName }))}
              />
              <TextInput
                placeholder="전화번호"
                placeholderTextColor={colors.mutedText}
                style={styles.input}
                keyboardType="phone-pad"
                value={form.phoneNumber}
                onChangeText={(phoneNumber) => setForm((current) => ({ ...current, phoneNumber }))}
              />
            </>
          ) : (
            <TextInput
              placeholder="로그인 아이디"
              placeholderTextColor={colors.mutedText}
              style={styles.input}
              autoCapitalize="none"
              value={form.loginId}
              onChangeText={(loginId) => setForm((current) => ({ ...current, loginId }))}
            />
          )}

          <TextInput
            placeholder="비밀번호"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            secureTextEntry
            value={form.password}
            onChangeText={(password) => setForm((current) => ({ ...current, password }))}
          />

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={() => void handleSubmit()}
            style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
          >
            <Text style={styles.primaryButtonLabel}>
              {isSubmitting ? '처리 중...' : currentCopy.submitLabel}
            </Text>
          </Pressable>
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  heroCard: {
    gap: 10,
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.accentStrong,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#d7e4d2',
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    color: '#fffef8',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#dfe8d8',
  },
  formCard: {
    gap: 12,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: '#efe6d6',
  },
  segmentButtonActive: {
    backgroundColor: colors.accentSoft,
  },
  segmentButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.mutedText,
  },
  segmentButtonTextActive: {
    color: colors.accentStrong,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.mutedText,
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surfaceStrong,
    color: colors.text,
    fontSize: 15,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: colors.accentStrong,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fffef8',
  },
});
