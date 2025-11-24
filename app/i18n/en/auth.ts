export default {
  login: {
    title: 'Sign in to your account',
    subtitle: 'Enter your credentials to access your account',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    button: 'Sign in',
    loading: 'Signing in...',
    success: 'Login successful',
    failed: 'Login failed',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    validation: {
      emailRequired: 'Email is mandatory. Please enter your email.',
      emailInvalid: 'Email is invalid',
      passwordRequired: 'Password is mandatory. Please enter your password',
      passwordInvalid: 'The password must be at least 8 - 16 characters, including uppercase, lowercase, numbers, special characters and not contain space',
    },
  },
  logout: {
    success: 'Logout successful',
    failed: 'Logout failed',
    button: 'Logout',
    confirm: 'Are you sure you want to logout?',
  },
  validation: {
    emailRequired: 'Email is mandatory. Please enter your email.',
    emailInvalid: 'Email is invalid',
    passwordRequired: 'Password is mandatory. Please enter your password',
    passwordInvalid: 'The password must be at least 8 - 16 characters, including uppercase, lowercase, numbers, special characters and not contain space',
    confirmPasswordRequired: 'Confirm Password is mandatory. Please enter your confirm password',
    confirmPasswordMismatch: 'The re-entered password must match the new password',
  },
  errors: {
    unauthorized: 'Unauthorized access. Please login again.',
    tokenExpired: 'Your session has expired. Please login again.',
    networkError: 'Network error. Please check your connection and try again.',
    serverError: 'Server error. Please try again later.',
    unknownError: 'An unexpected error occurred. Please try again.',
  },
}

