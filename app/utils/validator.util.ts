export const validateEmail = (email: string, t?: (key: string) => string): string | undefined => {
  // Rule 1: Check if email is empty or only whitespace
  if (!email || email.trim() === '') {
    return t ? t('auth.validation.emailRequired') : 'Email is mandatory. Please enter your email.'
  }

  // Rule 2: Check email format using a regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return t ? t('auth.validation.emailInvalid') : 'Email is invalid'
  }

  // If all checks pass, return null (no error)
  return
}

export const passwordRequirements = [
  { regex: /.{8,}/, text: 'Minimum of 8 characters' },
  { regex: /\d/, text: 'At least 1 number' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /^(?=.*[!@#$%^&*+\-])[A-Za-z0-9!@#$%^&*+\-]+$/, text: 'At least 1 special character' },
]

export const validatePassword = (password: string, t?: (key: string) => string): string | undefined => {
  // Check if password is empty
  if (!password || password.trim() === '') {
    return t ? t('auth.validation.passwordRequired') : 'Password is mandatory. Please enter your password'
  }

  // Check if password
  if (passwordRequirements.some(({ regex }) => !regex.test(password))) {
    return t ? t('auth.validation.passwordInvalid') : 'The password must be at least 8 - 16 characters, including uppercase, lowercase, numbers, special characters and not contain space'
  }

  // If all checks pass, return null or a success message
  return
}

export const validateConfirmPassword = (confirmPassword: string, password: string, t?: (key: string) => string) => {
  // Check if password is empty
  if (!confirmPassword || confirmPassword.trim() === '') {
    return t ? t('auth.validation.confirmPasswordRequired') : 'Confirm Password is mandatory. Please enter your confirm password'
  }

  // Check if not compare password
  if (confirmPassword != password) {
    return t ? t('auth.validation.confirmPasswordMismatch') : 'The re-entered password must match the new password'
  }

  // If all checks pass, return null or a success message
  return
}
