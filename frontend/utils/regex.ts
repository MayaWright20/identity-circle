import {
  EMAIL_VALIDATOR,
  NAME_VALIDATOR,
  USER_NAME_VALIDATOR,
  HAS_UPPERCASE,
  HAS_LOWERCASE,
  HAS_NUMBER,
  HAS_SPECIAL_CHAR,
  MIN_LENGTH_12,
} from '@/constants/regex';

export const isRegExValid = (value: string, regex: RegExp) => regex.test(value);

// export const
// export const EMAIL_VALIDATOR = /^[A-Za-z]+@[A-Za-z]+\.[A-Za-z]+$/;

// export const PHONE_VALIDATOR =
//   /^\+?[0-9]{1,3}?[\s-]?\(?[0-9]{2,4}\)?[\s-]?[0-9]{3,4}[\s-]?[0-9]{3,4}$/;

// export const NAME_VALIDATOR = /^(?=(?:.*[A-Za-z]){2,})[A-Za-z\s-]{2,}$/;

// export const USER_NAME_VALIDATOR = /^[A-Za-z0-9._-]{2,15}$/;

// export const HAS_UPPERCASE = /[A-Z]/;

// export const HAS_LOWERCASE = /[a-z]/;

// export const HAS_NUMBER = /[0-9]/;

// export const HAS_SPECIAL_CHAR = /[^A-Za-z0-9]/;

// export const MIN_LENGTH_12 = /^.{12,}$/;

export const regexErrorMessage = (regex: RegExp): string => {
  let errorMessage = 'Invalid format';

  switch (regex) {
    case EMAIL_VALIDATOR:
      errorMessage = 'Please enter a valid email';
      break;

    case NAME_VALIDATOR:
      errorMessage = 'Please enter a valid name';
      break;

    case USER_NAME_VALIDATOR:
      errorMessage = 'Please enter a valid username';
      break;

    case HAS_UPPERCASE:
      errorMessage = 'Password must contain at least one uppercase letter';
      break;

    case HAS_LOWERCASE:
      errorMessage = 'Password must contain at least one lowercase letter';
      break;

    case HAS_NUMBER:
      errorMessage = 'Password must contain at least one number';
      break;

    case HAS_SPECIAL_CHAR:
      errorMessage = 'Password must contain at least one special character';
      break;

    case MIN_LENGTH_12:
      errorMessage = 'Password must be at least 12 characters long';
      break;

    default:
      errorMessage = 'Invalid format';
      break;
  }

  return errorMessage;
};
