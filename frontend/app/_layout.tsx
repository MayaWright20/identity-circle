import { router, Stack } from 'expo-router';

// import { SessionProvider } from '../ctx';
import { SplashScreenController } from '@/components/splash-screen';
import CTA from '@/components/buttons/cta';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { AUTH_FORM, StoreState, useStore } from '@/store/store';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useMemo, useRef } from 'react';
import { COLORS } from '@/costants/colors';
import { SHADOW } from '@/costants/styles';
import { AuthRoutes } from '@/types';
import { isRegExValid } from '@/utils/isRegexValid';

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

  const isReversed = useRef(false);

  const isLogin = useMemo(() => authCTATitle === AuthRoutes.LOGIN, [authCTATitle]);
  const fieldsToValidate = useMemo(
    () => (isLogin ? [authForm[1], authForm[3]] : authForm),
    [isLogin, authForm],
  ); // Only use username and password for when validating login. See order in store.ts.

  const navigateToAuth = () => {
    router.navigate('/auth');
  };

  const isFormValidHandler = (): boolean => {
    for (const field of fieldsToValidate) {
      console.log('field', field.value);
      const isFieldValid = field.validator.every((validator) =>
        isRegExValid(field.value, validator),
      );

      if (!isFieldValid) {
        console.log(`${field.id} validation failed:`, field.value);

        return false;
      }

      console.log(`${field.id} validation passed:`, field.value);
    }

    console.log('All form fields are valid');
    return true;
  };

  const authBtnHandler = () => {
    if (!isAuthBgCol) {
      navigateToAuth();
      setIsAuthBgCol(false);
    } else {
      const isValid = isFormValidHandler();

      if (isValid) {
        console.log('Form is valid, proceeding with authentication...');
        // TODO: Add actual authentication logic here
      }

      console.log('islogin', isLogin);
    }
  };

  const loginHandler = () => {
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
        <Stack.Protected guard={true}>
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
        <Stack.Protected guard={false}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
      {!isAuthBgCol && (
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
              onPress={loginHandler}
              style={!isAuthBgCol && styles.cta}
            />
          </SafeAreaView>
        </>
      )}
      <SafeAreaView
        style={[
          styles.authBtnSafeAreaView,
          { backgroundColor: isAuthBgCol ? COLORS.CREAM_0 : undefined },
        ]}>
        <CTA style={!isAuthBgCol && styles.cta} onPress={authBtnHandler} title={authCTATitle} />
      </SafeAreaView>
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
