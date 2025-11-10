import { Stack } from 'expo-router';

// import { SessionProvider } from '../ctx';
import { SplashScreenController } from '@/components/splash-screen';
import CTA from '@/components/buttons/cta';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { authHandler } from '@/utils/auth';
import { AUTH_FORM, useStore } from '@/store/store';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef } from 'react';
import { COLORS } from '@/costants/colors';
import { SHADOW, SHADOW_PINK_0 } from '@/costants/styles';

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
  const isAuthScreen = useStore((state: any) => state.isAuthScreen);
  const authForm = useStore((state: any) => state.authForm);
  const setIsAuthScreen = useStore((state: any) => state.setIsAuthScreen);
  const setAuthForm = useStore((state: any) => state.setAuthForm);

  const isReversed = useRef(false);

  const authBtnHandler = () => {
    if (!isAuthScreen) {
      authHandler('false', '/auth');
      setIsAuthScreen(false);
    } else {
      console.log('form', authForm);
    }
  };

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  // const handleVideoEnd = () => {
  //   if (isReversed.current) {
  //     player.currentTime = 0;
  //     player.playbackRate = 1;
  //     isReversed.current = false;
  //   } else {
  //     player.currentTime = player.duration || 0;
  //     player.playbackRate = -1;
  //     isReversed.current = true;
  //   }
  //   player.play();
  // };

  useEffect(() => {
    setIsAuthScreen(false);
    setAuthForm(AUTH_FORM);
  }, [setIsAuthScreen, setAuthForm]);

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
      {!isAuthScreen && (
        <>
          <VideoView
            style={styles.pictureContainer}
            player={player}
            contentFit="cover"
            nativeControls={false}
          />
          <SafeAreaView style={styles.safeAreaView}>
            <CTA
              title={'Log in'}
              onPress={() => authHandler('true', '/auth')}
              style={!isAuthScreen && styles.cta}
            />
          </SafeAreaView>
        </>
      )}
      <SafeAreaView
        style={[styles.authBtnSafeAreaView, { backgroundColor: isAuthScreen && COLORS.CREAM_0 }]}>
        <CTA style={!isAuthScreen && styles.cta} onPress={authBtnHandler} title={authCTATitle} />
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
  container: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cta: {
    ...SHADOW,
    ...SHADOW_PINK_0,
  },
});
