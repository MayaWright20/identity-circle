import { StyleSheet, View } from "react-native";
import { useEffect } from "react";

import CTA from "@/components/buttons/cta";
import { authHandler } from "@/utils/auth";
import { COLORS } from "@/costants/colors";
import { AUTH_FORM, useStore } from "@/store/store";

export default function Index() {
  const setIsAuthScreen = useStore((state: any)=> state.setIsAuthScreen);
  const setAuthForm = useStore((state: any)=> state.setAuthForm);

  useEffect(()=> {
      setIsAuthScreen(false);
      setAuthForm(AUTH_FORM)
  },[setIsAuthScreen])

  return (
    <View style={styles.btnWrapper}>
      <CTA title={"Log in"} onPress={()=> authHandler("true", "/auth")} />
    </View>
  );
}

const styles = StyleSheet.create({
  btnWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 0,
    backgroundColor: COLORS.RED_0
  }
});
