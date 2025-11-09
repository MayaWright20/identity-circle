import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CTA from "@/components/buttons/cta";
import TextInputComponent from "@/components/inputs/text-input";

import { COLORS } from "@/costants/colors";
import { useStorageState } from "@/store/store";
import { AUTH_ROUTE } from "@/types";

// import { useSession } from '../ctx';
interface AuthForm {
  username: string;
  password: string;
}

interface AuthSignupForm extends AuthForm {
  name: string;
  email: string;
}

interface AuthItem {
  label: string;
  id: string;
  isLowercase?: boolean;
}

type AUTH_ITEM = Record<string, AuthItem[]>;

const AUTH_ITEMS: AUTH_ITEM = {
  true: [
    // Login
    {
      id: "username",
      label: "Username | Email",
      isLowercase: true
    },
    {
      id: "password",
      label: "Password",
    },
  ],
  false: [
    // Sign up
    {
      id: "name",
      label: "Name",
    },
    {
      id: "username",
      label: "Username",
      isLowercase: true
    },
    {
      id: "email",
      label: "Email",
      isLowercase: true
    },
    {
      id: "password",
      label: "Password",
    },
  ],
};

export default function SignIn() {
  //   const { signIn } = useSession();
  const [formData, setFormData] = useState<AuthSignupForm>({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [storage, setStorageHandler] = useStorageState(AUTH_ROUTE);
  const formItems = useMemo(() => AUTH_ITEMS[`${storage[1]}`], [storage]);

  const backCta = () => {
    router.navigate("/");
  };

  const authHandler = async() => {
    console.log("formData", formData)
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <CTA isSmall style={styles.backCTA} title={"Back"} onPress={backCta} />
      <View style={styles.form}>
        {formItems &&
          formItems.map((item, index) => {
            return (
              <TextInputComponent
                onChangeText={(value) => setFormData(prev => ({...prev, [item.id]: value }))}
                key={index}
                backgroundColor={COLORS.RED_0}
                label={item.label}
              />
            );
          })}
      </View>
      <CTA
        title={storage[1] === "true" ? "Login" : "Sign up"}
        onPress={authHandler}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.CREAM_0,
  },
  backCTA: {
    alignSelf: "flex-start",
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
});
