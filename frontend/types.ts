export const AUTH_ROUTE = 'AUTH_ROUTE';

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

export interface AuthForm {
  username: ErrorStateValue;
  password: ErrorStateValue;
}

export interface AuthSignupForm extends AuthForm {
  name: ErrorStateValue;
  email: ErrorStateValue;
}

export enum AuthRoutes {
  LOGIN = 'Login',
  SING_UP = 'Sign up',
}
