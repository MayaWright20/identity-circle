import { router, Stack } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useMemo, useRef } from 'react';

import useProfile from '@/hooks/useProfile';
import CTA from '@/components/buttons/cta';

import { SplashScreenController } from '@/components/splash-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { AUTH_FORM, StoreState, usePersistStore, useStore } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { SHADOW } from '@/constants/styles';
import { AuthRoutes, FormData } from '@/types';
import { isRegExValid, regexErrorMessage } from '@/utils/regex';

const videoSource = require('../assets/videos/Fuzz.mp4');

export default function RootLayout() {
  return (
    <>
      <SplashScreenController />
      <RootNavigator />
    </>
  );
}

function RootNavigator() {
  const authCTATitle = useStore((state: StoreState) => state.authCTATitle);
  const setAuthCTATitle = useStore((state: StoreState) => state.setAuthCTATitle);
  const isAuthBgCol = useStore((state: StoreState) => state.isAuthBgCol);
  const setIsAuthBgCol = useStore((state: StoreState) => state.setIsAuthBgCol);
  const authForm = useStore((state: StoreState) => state.authForm);
  const setAuthForm = useStore((state: StoreState) => state.setAuthForm);
  const updateAuthFormField = useStore((state: StoreState) => state.updateAuthFormField);

  const sessionToken = usePersistStore((state: any) => state.sessionToken);

  const { signUp, login } = useProfile();

  const isReversed = useRef(false);

  const isLogin = useMemo(() => authCTATitle === AuthRoutes.LOGIN, [authCTATitle]);
  const fieldsToValidate = useMemo(
    // fieldsToValidate uses username and password for when validating login. See order in store.ts.
    () => (isLogin ? [authForm[1], authForm[3]] : authForm),
    [isLogin, authForm],
  );

  const navigateToAuth = () => {
    router.navigate('/auth');
  };

  const isFormValid = (): boolean => {
    let failedValidator: RegExp | null = null;
    for (const field of fieldsToValidate) {
      failedValidator =
        field.validator.find((validator) => !isRegExValid(field.value, validator)) || null;

      if (failedValidator) {
        updateAuthFormField(
          isLogin ? 'password' : field.id,
          undefined,
          true,
          isLogin ? 'Invalid credentials' : regexErrorMessage(failedValidator),
        );
      }
      if (failedValidator) return false;
    }
    return true;
  };

  const getAuthFormData = () => {
    const formData: FormData = {};

    authForm.map((item) => {
      formData[item.id] = item.value;
    });

    return formData;
  };

  const authBtnHandler = async () => {
    if (!isAuthBgCol) {
      navigateToAuth();
      setIsAuthBgCol(false);
    } else {
      if (isFormValid()) {
        const formData = getAuthFormData();

        if (isLogin) {
          login(formData);
        } else {
          signUp(formData, isLogin);
        }
      }
    }
  };

  const loginAuthHandler = () => {
    navigateToAuth();
    setAuthCTATitle(AuthRoutes.LOGIN);
  };

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    setIsAuthBgCol(false);
    setAuthForm(AUTH_FORM);
  }, [setIsAuthBgCol, setAuthForm]);

  useEffect(() => {
    const handleVideoEnd = () => {
      if (isReversed.current) {
        player.currentTime = 0;
        player.playbackRate = 1;
        isReversed.current = false;
      } else {
        player.currentTime = player.duration || 0;
        player.playbackRate = -1;
        isReversed.current = true;
      }
      player.play();
    };

    const subscription = player.addListener('playToEnd', handleVideoEnd);

    return () => subscription?.remove();
  }, [player]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!sessionToken}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              animation: 'slide_from_left',
            }}
          />
          <Stack.Screen
            name="auth"
            options={{
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!!sessionToken}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
      {!isAuthBgCol && !sessionToken && (
        <>
          <VideoView
            style={styles.pictureContainer}
            player={player}
            contentFit="cover"
            nativeControls={false}
          />
          <SafeAreaView style={styles.safeAreaView}>
            <CTA
              title={AuthRoutes.LOGIN}
              onPress={loginAuthHandler}
              style={!isAuthBgCol && styles.cta}
            />
          </SafeAreaView>
        </>
      )}
      {!sessionToken && (
        <SafeAreaView
          style={[
            styles.authBtnSafeAreaView,
            { backgroundColor: isAuthBgCol ? COLORS.CREAM_0 : undefined },
          ]}>
          <CTA style={!isAuthBgCol && styles.cta} onPress={authBtnHandler} title={authCTATitle} />
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    paddingBottom: '-100%',
  },
  authBtnSafeAreaView: {
    paddingTop: '-100%',
  },
  pictureContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  cta: {
    ...SHADOW,
  },
});
