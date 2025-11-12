import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useEffect, useCallback, useReducer } from 'react';
// import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthRoutes, AutoCapitalize, ErrorStateValue, UseStateHook } from '@/types';

import {
  EMAIL_VALIDATOR,
  HAS_LOWERCASE,
  HAS_NUMBER,
  HAS_SPECIAL_CHAR,
  HAS_UPPERCASE,
  MIN_LENGTH_12,
  NAME_VALIDATOR,
  USER_NAME_VALIDATOR,
} from '@/constants/regex';

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

const sessionStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const data = (await AsyncStorage.getItem(name)) || null;
    return data;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
  clearStore: async (): Promise<void> => {
    await AsyncStorage.clear();
  },
};

export const usePersistStore = create()(
  persist(
    (set, get) => ({
      sessionToken: null,
      setSessionToken: (sessionToken: null | string) => set({ sessionToken }),
    }),
    {
      name: 'session',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
