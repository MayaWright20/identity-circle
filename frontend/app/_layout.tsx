import { router, Stack } from 'expo-router';

// import { SessionProvider } from '../ctx';
import { SplashScreenController } from '@/components/splash-screen';
import CTA from '@/components/buttons/cta';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { AUTH_FORM, useStore } from '@/store/store';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef } from 'react';
import { COLORS } from '@/costants/colors';
import { SHADOW } from '@/costants/styles';
import { AuthRoutes } from '@/types';

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
  const authCTATitle = useStore((state: any) => state.authCTATitle);
  const setAuthCTATitle = useStore((state: any) => state.setAuthCTATitle);
  const isAuthBgCol = useStore((state: any) => state.isAuthBgCol);
  const setIsAuthBgCol = useStore((state: any) => state.setIsAuthBgCol);
  const authForm = useStore((state: any) => state.authForm);
  const setAuthForm = useStore((state: any) => state.setAuthForm);

  const isReversed = useRef(false);

  const navigateToAuth = () => {
    router.navigate('/auth');
  };

  const authBtnHandler = () => {
    if (!isAuthBgCol) {
      navigateToAuth();
      setIsAuthBgCol(false);
    } else {
      console.log('form', authForm);
      if (authCTATitle === 'Login') {
        console.log('Log in');
      }

      if (authCTATitle === 'Sign up') {
        console.log('sign up');
      }
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
        style={[styles.authBtnSafeAreaView, { backgroundColor: isAuthBgCol && COLORS.CREAM_0 }]}>
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
