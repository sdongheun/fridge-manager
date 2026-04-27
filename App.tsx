import 'expo-dev-client';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { colors } from './src/constants/colors';
import { getCurrentUser, onAuthStateChange } from './src/features/auth/service';
import type { AuthUser } from './src/features/auth/types';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch (error) {
        if (isMounted) {
          setSessionError(
            error instanceof Error ? error.message : '세션 확인 중 오류가 발생했습니다.',
          );
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    void checkSession();

    const unsubscribe = onAuthStateChange((user) => {
      if (!isMounted) {
        return;
      }

      setCurrentUser(user);
      setSessionError(null);
      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      {isCheckingSession ? (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.accentStrong} />
            <Text style={styles.stateText}>세션을 확인하고 있습니다.</Text>
          </View>
        </SafeAreaView>
      ) : sessionError ? (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerState}>
            <Text style={styles.errorTitle}>앱 시작에 실패했습니다.</Text>
            <Text style={styles.stateText}>{sessionError}</Text>
          </View>
        </SafeAreaView>
      ) : currentUser ? (
        <HomeScreen currentUser={currentUser} onSignedOut={() => setCurrentUser(null)} />
      ) : (
        <AuthScreen onSignedIn={() => setSessionError(null)} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  stateText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: colors.mutedText,
  },
});
