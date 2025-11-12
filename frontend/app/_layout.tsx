import { router, Stack } from 'expo-router';
import axios from 'axios';

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

  const isReversed = useRef(false);

  const isLogin = useMemo(() => authCTATitle === AuthRoutes.LOGIN, [authCTATitle]);
  // fieldsToValidate uses username and password for when validating login. See order in store.ts.
  const fieldsToValidate = useMemo(
    () => (isLogin ? [authForm[1], authForm[3]] : authForm),
    [isLogin, authForm],
  );

  const navigateToAuth = () => {
    router.navigate('/auth');
  };

  const isFormValidHandler = (): boolean => {
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

  //  "GET /",
  //     "POST /user/signup",
  //     "POST /user/login",
  //     "GET /user/profile",
  //     "GET /user/logout",
  //     "DELETE /user/delete",
  //     "POST /api/v1/user/signup",
  //     "POST /api/v1/user/login",
  //     "GET /api/v1/user/profile",
  //     "GET /api/v1/user/logout",
  //     "DELETE /api/v1/user/delete",
  type FormData = Record<string, string>;
  const signUp = async (formData: FormData) => {
    console.log('=== SIGNUP REQUEST DEBUG ===');
    console.log('URL:', `${process.env.EXPO_PUBLIC_URL}/user/signup`);
    console.log('FormData being sent:', JSON.stringify(formData, null, 2));

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}/user/signup`, formData);
      console.log('=== SIGNUP SUCCESS ===');
      console.log('Response:', response.data);
      if (response.data.success) {
        console.log('Token received:', response.data.token);
        // set token
        // go to profile
      }
    } catch (err: any) {
      // Show the actual validation errors from backend
      // if (err.response?.data?.message) {
      console.log('err.response.data.message.id', err.response.data.message.id);
      updateAuthFormField(
        isLogin ? 'password' : err.response.data.id,
        undefined,
        true,
        err.response?.data?.message,
      );
      console.log('Validation errors:', err.response.data.message);
      // }
    }
  };

  const login = async (formData: FormData) => {
    console.log('formData', formData);
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_URL}/user/login`, formData);
    } catch (err) {
      console.log('login err', err);
    }
  };

  const getAuthFormData = () => {
    console.log('getAuthFormData called, authForm:', authForm);
    const formData: FormData = {};
    authForm.map((item) => {
      formData[item.id] = item.value;
      console.log('item', item.id, item.value);
    });
    console.log('Constructed formData:', formData);
    return formData;
  };

  const authBtnHandler = () => {
    console.log('authBtnHandler called, isAuthBgCol:', isAuthBgCol);
    if (!isAuthBgCol) {
      navigateToAuth();
      setIsAuthBgCol(false);
    } else {
      const isValid = isFormValidHandler();
      console.log('Form validation result:', isValid);

      if (isValid) {
        // Login || Sign up
        // login();
        const formData = getAuthFormData();
        console.log('Final formData:', formData);

        if (isLogin) {
          login(formData);
        } else {
          signUp(formData);
        }
      }
      // else {
      //   signUp();
      // }
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
              onPress={loginAuthHandler}
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
