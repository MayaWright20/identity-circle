import { StoreState } from '@/store/store';
import { ErrorStateValue } from '@/types';
import { useStore } from '@/store/store';
import { useCallback } from 'react';

export default function useAuthForm() {
  const updateAuthFormField = useStore((state: StoreState) => state.updateAuthFormField);
  const resetAuthForm = useStore((state: StoreState) => state.resetAuthForm);

  const updateFormHandler = useCallback(
    (item: ErrorStateValue, value: string) => {
      updateAuthFormField(item.id, value);
    },
    [updateAuthFormField],
  );

  const resetForm = useCallback(() => {
    resetAuthForm();
  }, [resetAuthForm]);

  return {
    resetForm,
    updateFormHandler,
  };
}
