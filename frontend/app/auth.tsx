import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CTA from '@/components/buttons/cta';
import TextInputComponent from '@/components/inputs/text-input';

import { COLORS } from '@/costants/colors';
import { AUTH_FORM, StoreState, useStore } from '@/store/store';
import { AuthRoutes, AutoCapitalize, ErrorStateValue } from '@/types';
import {
  EMAIL_VALIDATOR,
  HAS_LOWERCASE,
  HAS_NUMBER,
  HAS_SPECIAL_CHAR,
  HAS_UPPERCASE,
  MIN_LENGTH_12,
  NAME_VALIDATOR,
  USER_NAME_VALIDATOR,
} from '@/costants/regex';

// import { useSession } from '../ctx';

interface AuthItem {
  label: string;
  id: string;
  autoCapitalize: AutoCapitalize;
  secureTextEntry?: boolean;
}

type AUTH_ITEM = Record<AuthRoutes.LOGIN | AuthRoutes.SING_UP, AuthItem[]>;

// const AUTH_ITEMS: AUTH_ITEM = {
//   Login: [
//     {
//       id: 'username',
//       label: 'Username | Email',
//       autoCapitalize: AutoCapitalize.none,
//     },
//     {
//       id: 'password',
//       label: 'Password',
//       autoCapitalize: AutoCapitalize.none,
//       secureTextEntry: true,
//     },
//   ],
//   'Sign up': [
//     {
//       id: 'name',
//       label: 'Name',
//       autoCapitalize: AutoCapitalize.words,
//     },
//     {
//       id: 'username',
//       label: 'Username',
//       autoCapitalize: AutoCapitalize.none,
//     },
//     {
//       id: 'email',
//       label: 'Email',
//       autoCapitalize: AutoCapitalize.none,
//     },
//     {
//       id: 'password',
//       label: 'Password',
//       autoCapitalize: AutoCapitalize.none,
//       secureTextEntry: true,
//     },
//   ],
// };

// // Order of AUTH_FORM_INITIAL_STATE cannot change see _layout fieldsToValidate function
// export const AUTH_FORM: ErrorStateValue[] = [
//   {
//     id: 'name',
//     label: 'name',
//     value: '',
//     errorMessage: 'name error message',
//     validator: [NAME_VALIDATOR],
//     showErrorMessage: false,
//     autoCapitalize: AutoCapitalize.words,
//   },
//   {
//     id: 'username',
//     label: 'Username',
//     value: '',
//     errorMessage: 'username error message',
//     validator: [USER_NAME_VALIDATOR],
//     showErrorMessage: false,
//     autoCapitalize: AutoCapitalize.none,
//   },
//   {
//     id: 'email',
//     label: 'Email',
//     value: '',
//     errorMessage: 'email error message',
//     validator: [EMAIL_VALIDATOR],
//     showErrorMessage: false,
//     autoCapitalize: AutoCapitalize.none,
//   },
//   {
//     id: 'password',
//     label: 'Password',
//     value: '',
//     errorMessage: 'password error message',
//     validator: [HAS_UPPERCASE, HAS_LOWERCASE, HAS_NUMBER, HAS_SPECIAL_CHAR, MIN_LENGTH_12],
//     showErrorMessage: false,
//     autoCapitalize: AutoCapitalize.none,
//   },
// ];

export default function SignIn() {
  //   const { signIn } = useSession();
  const isLogin = useStore((state: StoreState) => state.authCTATitle);
  const setAuthCTATitle = useStore((state: StoreState) => state.setAuthCTATitle);
  const setIsAuthBgCol = useStore((state: StoreState) => state.setIsAuthBgCol);
  const authForm = useStore((state: StoreState) => state.authForm);
  const setAuthForm = useStore((state: StoreState) => state.setAuthForm);

  const backCta = () => {
    setAuthCTATitle(AuthRoutes.SING_UP);
    setIsAuthBgCol(false);
    setAuthForm(AUTH_FORM);
    router.navigate('/');
  };

  const updateFormHandler = (item: ErrorStateValue, value: string) => {
    const updatedForm = authForm.map((field) => {
      if (field.id === item.id) {
        return {
          ...field,
          value: value,
          showErrorMessage: false,
        };
      }
      return field;
    });
    setAuthForm(updatedForm);
  };

  useEffect(() => {
    setIsAuthBgCol(true);
  }, [setAuthCTATitle, setIsAuthBgCol]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <CTA isSmall style={styles.backCTA} title={'Back'} onPress={backCta} />
      <View style={styles.form}>
        {AUTH_FORM &&
          AUTH_FORM.map((item, index) => {
            const formField = authForm.find((field) => field.id === item.id);

            if (isLogin === AuthRoutes.LOGIN && (item.id === 'name' || item.id === 'email')) return;

            return (
              <TextInputComponent
                autoCapitalize={item.autoCapitalize}
                value={formField?.value || ''}
                onChangeText={(value) => {
                  updateFormHandler(item, value);
                  // const updatedForm = authForm.map((field) => {
                  //   if (field.id === item.id) {
                  //     return {
                  //       ...field,
                  //       value: value,
                  //     };
                  //   }
                  //   return field;
                  // });
                  // setAuthForm(updatedForm);
                }}
                key={index}
                color={COLORS.RED_0}
                backgroundColor={COLORS.PINK_0}
                label={
                  isLogin === AuthRoutes.LOGIN && item.id === 'username'
                    ? 'Username | Email'
                    : item.label
                }
                secureTextEntry={item.secureTextEntry}
                errorMessage={formField?.errorMessage}
                showErrorMessage={formField?.showErrorMessage}
              />
            );
          })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.CREAM_0,
  },
  backCTA: {
    alignSelf: 'flex-start',
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
});
