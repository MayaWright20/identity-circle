import { Stack } from "expo-router";

// import { SessionProvider } from '../ctx';
import { SplashScreenController } from "@/components/splash-screen";
import CTA from "@/components/buttons/cta";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { authHandler } from "@/utils/auth";
import { useStore } from "@/store/store";
import { COLORS } from "@/costants/colors";

export default function RootLayout() {
  // Set up the auth context and render your layout inside of it.
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

  const authBtnHandler = () => {
    authHandler("false", "/auth");
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={true}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              animation: "slide_from_left",
            }}
          />
          <Stack.Screen
            name="auth"
            options={{
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={false}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
      <SafeAreaView
        style={[
          styles.safeAreaView,
          { backgroundColor: isAuthScreen ? COLORS.CREAM_0 : COLORS.RED_0 },
        ]}
      >
        <CTA onPress={authBtnHandler} title={authCTATitle} style={styles.btn} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: "-100%",
  },
  btn: {
    backgroundColor: "green",
  },
});
