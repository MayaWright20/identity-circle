import { StoreState, usePersistStore, useStore } from '@/store/store';
import { FormData } from '@/types';
import axios from 'axios';

export default function useProfile() {
  const setSessionToken = usePersistStore((state: any) => state.setSessionToken);
  const updateAuthFormField = useStore((state: StoreState) => state.updateAuthFormField);

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

  return {
    signUp,
    login,
  };
}
