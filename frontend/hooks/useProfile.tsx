import { StoreState, usePersistStore, useStore } from '@/store/store';
import { AuthRoutes, FormData } from '@/types';
import axios from 'axios';

export default function useProfile() {
  const sessionToken = usePersistStore((state: any) => state.sessionToken);
  const setSessionToken = usePersistStore((state: any) => state.setSessionToken);
  const updateAuthFormField = useStore((state: StoreState) => state.updateAuthFormField);
  const resetAuthForm = useStore((state: StoreState) => state.resetAuthForm);
  const setIsAuthBgCol = useStore((state: StoreState) => state.setIsAuthBgCol);
  const setAuthCTATitle = useStore((state: StoreState) => state.setAuthCTATitle);

  const getProfile = async (token: string) => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setSessionToken(token);
      }
    } catch (err: any) {
      console.log(err.response.data.message);
    }
  };

  const signUp = async (formData: FormData, isLogin: boolean) => {
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}/user/signup`, formData);

      if (response.data.success) {
        const token = response.data.token;
        getProfile(token);
      }
    } catch (err: any) {
      updateAuthFormField(
        isLogin ? 'password' : err.response.data.id,
        undefined,
        true,
        err.response?.data?.message,
      );
    }
  };

  const login = async (formData: FormData) => {
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}/user/login`, formData);

      if (response.data.success) {
        const token = response.data.token;
        getProfile(token);
      }
    } catch (err: any) {
      updateAuthFormField('password', undefined, true, err.response?.data?.message);
    }
  };

  const logOut = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_URL}/user/logout`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (response.status === 200) {
        resetAuthForm();
        setIsAuthBgCol(false);
        setAuthCTATitle(AuthRoutes.SING_UP);
        setSessionToken(null);
      }
    } catch (err: any) {
      console.log('This error logout', err.response.data.message);
    }
  };

  return {
    signUp,
    login,
    logOut,
  };
}
