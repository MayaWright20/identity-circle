export type FormData = Record<string, string>;
export type UseStateHook<T> = [string, (value: T | null) => void];

export enum AutoCapitalize {
  none = 'none',
  sentences = 'sentences',
  words = 'words',
  characters = 'characters',
}

export interface TextInput {
  id: string;
  value: string;
  label: string;
  autoCapitalize?: AutoCapitalize;
  secureTextEntry?: boolean;
}

export interface ErrorStateValue extends TextInput {
  errorMessage: string;
  validator: RegExp[];
  showErrorMessage: boolean;
}

export enum AuthRoutes {
  LOGIN = 'Login',
  SING_UP = 'Sign up',
}

export enum Storage {
  SESSION = 'session',
  APP_NAME = 'identity-circle',
}
