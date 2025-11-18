// utils/emailUtils.ts
export function maskEmail(email: string): string {
  // Return early if email is invalid or empty
  if (!email || !email.includes('@')) {
    return email
  }

  // Split email into local part and domain
  const [localPart, domain] = email.split('@')

  // Handle short local parts
  if (localPart.length <= 2) {
    return `${localPart[0]}****@${domain}`
  }

  // Mask the email: keep first and last character, replace middle with asterisks
  const firstChar = localPart[0]
  const lastChar = localPart[localPart.length - 1]
  const maskedMiddle = '*****' // Fixed length for consistency

  return `${firstChar}${maskedMiddle}${lastChar}@${domain}`
}
