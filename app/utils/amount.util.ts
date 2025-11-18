interface FormatOptions {
  decimals?: number
  decimalSeparator?: string
  thousandSeparator?: string
}

export function formatAmount(amount: number, options: FormatOptions = {}): string {
  const { decimals = undefined, decimalSeparator = '.', thousandSeparator = ',' } = options

  // Handle rounding if decimals is specified
  const formattedAmount = decimals !== undefined ? amount.toFixed(decimals) : amount.toString()

  const parts = formattedAmount.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)

  return parts.join(decimalSeparator)
}

export function roundTo(value : number, decimalPlaces = 1) {
  const factor = Math.pow(10, decimalPlaces)
  return Math.round(value * factor) / factor
}
