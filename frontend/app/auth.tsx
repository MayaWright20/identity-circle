import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CTA from "@/components/buttons/cta";
import TextInputComponent, { AutoCapitalize } from "@/components/inputs/text-input";

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
  autoCapitalize: AutoCapitalize;
  secureTextEntry?: boolean;
}

type AUTH_ITEM = Record<string, AuthItem[]>;

const AUTH_ITEMS: AUTH_ITEM = {
  true: [
    // Login
    {
      id: "username",
      label: "Username | Email",
      autoCapitalize: AutoCapitalize.none
    },
    {
      id: "password",
      label: "Password",
      autoCapitalize: AutoCapitalize.none,
      secureTextEntry: true
    },
  ],
  false: [
    // Sign up
    {
      id: "name",
      label: "Name",
      autoCapitalize: AutoCapitalize.words
    },
    {
      id: "username",
      label: "Username",
      autoCapitalize: AutoCapitalize.none
    },
    {
      id: "email",
      label: "Email",
      autoCapitalize: AutoCapitalize.none
    },
    {
      id: "password",
      label: "Password",
      autoCapitalize: AutoCapitalize.none,
      secureTextEntry: true
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
                autoCapitalize={item.autoCapitalize}
                onChangeText={(value) => setFormData(prev => ({...prev, [item.id]: value }))}
                key={index}
                backgroundColor={COLORS.RED_0}
                label={item.label}
                secureTextEntry={item.secureTextEntry}
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
