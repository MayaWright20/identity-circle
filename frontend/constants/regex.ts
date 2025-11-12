export const EMAIL_VALIDATOR = /^[A-Za-z0-9._-]+@[A-Za-z]+\.[A-Za-z]+$/;

export const PHONE_VALIDATOR =
  /^\+?[0-9]{1,3}?[\s-]?\(?[0-9]{2,4}\)?[\s-]?[0-9]{3,4}[\s-]?[0-9]{3,4}$/;

export const NAME_VALIDATOR = /^(?=(?:.*[A-Za-z]){2,})[A-Za-z\s-]{2,}$/;

export const USER_NAME_VALIDATOR = /^[A-Za-z0-9._-]{2,15}$/;

export const HAS_UPPERCASE = /[A-Z]/;

export const HAS_LOWERCASE = /[a-z]/;

export const HAS_NUMBER = /[0-9]/;

export const HAS_SPECIAL_CHAR = /[^A-Za-z0-9]/;

export const MIN_LENGTH_12 = /^.{12,}$/;
