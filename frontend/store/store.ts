import { create } from 'zustand';
import  { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

interface StoreState {
  authCTATitle: string;
  setAuthCTATitle: (title: string) => void;
  isAuthScreen: boolean;
  setAuthScreen: (isAuthScreen: boolean) => void;
}

export const useStore = create<StoreState | any>((set, get) => ({
  authCTATitle: 'Sign up',
  setAuthCTATitle: (title: string) => set(() => ({ authCTATitle: title })),
  isAuthScreen: false,
  setIsAuthScreen: (isAuthScreen: boolean) => set(() => ({ isAuthScreen })),
}));


function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
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
    [key, setStorage]
  );

  return [storage, setStorageHandler];
}
