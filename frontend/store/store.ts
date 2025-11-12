import { create } from 'zustand';
import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';

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

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

// Order of AUTH_FORM cannot change see _layout.tsx fieldsToValidate function
export const AUTH_FORM: ErrorStateValue[] = [
  {
    id: 'name',
    label: 'name',
    value: '',
    errorMessage: 'name error message',
    validator: [NAME_VALIDATOR],
    showErrorMessage: false,
    autoCapitalize: AutoCapitalize.words,
  },
  {
    id: 'username',
    label: 'Username',
    value: '',
    errorMessage: 'username error message',
    validator: [USER_NAME_VALIDATOR],
    showErrorMessage: false,
    autoCapitalize: AutoCapitalize.none,
  },
  {
    id: 'email',
    label: 'Email',
    value: '',
    errorMessage: 'email error message',
    validator: [EMAIL_VALIDATOR],
    showErrorMessage: false,
    autoCapitalize: AutoCapitalize.none,
  },
  {
    id: 'password',
    label: 'Password',
    value: '',
    errorMessage: 'password error message',
    validator: [HAS_UPPERCASE, HAS_LOWERCASE, HAS_NUMBER, HAS_SPECIAL_CHAR, MIN_LENGTH_12],
    showErrorMessage: false,
    autoCapitalize: AutoCapitalize.none,
    secureTextEntry: true,
  },
];

export interface StoreState {
  authCTATitle: AuthRoutes;
  setAuthCTATitle: (authCTATitle: AuthRoutes) => void;
  isAuthBgCol: boolean;
  setIsAuthBgCol: (isAuthBgCol: boolean) => void;
  authForm: ErrorStateValue[];
  setAuthForm: (authForm: ErrorStateValue[]) => void;
  updateAuthFormField: (
    fieldId: string,
    value?: string,
    showErrorMessage?: boolean,
    errorMessage?: string,
  ) => void;
  resetAuthForm: () => void;
}

export const useStore = create<StoreState | any>((set, get) => ({
  authCTATitle: 'Sign up',
  setAuthCTATitle: (authCTATitle: AuthRoutes) => set(() => ({ authCTATitle })),
  isAuthBgCol: false,
  setIsAuthBgCol: (isAuthBgCol: boolean) => set(() => ({ isAuthBgCol })),
  authForm: AUTH_FORM,
  setAuthForm: (authForm: ErrorStateValue[]) => set(() => ({ authForm })),
  updateAuthFormField: (
    fieldId: string,
    value?: string,
    showErrorMessage?: boolean,
    errorMessage?: string,
  ) =>
    set((state: { authForm: ErrorStateValue[] }) => ({
      authForm: state.authForm.map((field: ErrorStateValue) =>
        field.id === fieldId
          ? {
              ...field,
              ...(value !== undefined && { value }),
              ...(showErrorMessage !== undefined && { showErrorMessage }),
              ...(errorMessage !== undefined && { errorMessage }),
            }
          : field,
      ),
    })),
  resetAuthForm: () =>
    set(() => ({
      authForm: AUTH_FORM.map((field) => ({
        ...field,
        value: '',
        showErrorMessage: false,
      })),
    })),
}));

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue,
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: any) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [storage, setStorage] = useAsyncState<string>();

  useEffect(() => {
    SecureStore.getItemAsync(key).then((value: any) => {
      setStorage(value);
    });
  }, [key, setStorage]);

  const setStorageHandler = useCallback(
    (value: any) => {
      setStorage(value);
      setStorageItemAsync(key, value);
    },
    [key, setStorage],
  );

  return [storage, setStorageHandler];
}
