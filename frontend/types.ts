export const AUTH_ROUTE = "AUTH_ROUTE";

export interface AuthForm {
  username: string;
  password: string;
}

export interface AuthSignupForm extends AuthForm {
  name: string;
  email: string;
}