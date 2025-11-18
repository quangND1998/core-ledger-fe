import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { formatDistanceStrict } from 'date-fns'
import {getTime} from 'date-fns/getTime'
import { vi } from 'date-fns/locale'

/**
 * Date
 * @param val
 * @param format
 * @returns {string}
 */
export function date(val, format) {
  return datetime(val, format)
}

export function dateFormat(val, format = 'dd/MM/yyyy') {
  return datetime(val, format)
}

/**
 * Datetime
 * @param val
 * @param convertFormat
 * @returns {string}
 */
export function datetime(val, convertFormat = 'dd-MM-yyyy HH:mm:ss') {
  if (!val) {
    return ''
  }
  const date = isNumber(val) ? new Date(val * 1000) : new Date(val)
  return format(date, convertFormat, { awareOfUnicodeTokens: true })
}

export function datetimeFormatToTimeZone(
  val,
  convertFormat = 'YYYY-MM-DDTHH:mm:ss',
  timezone
) {
  if (!val) {
    return ''
  }
  const date = isNumber(val) ? new Date(val * 1000) : val
  let dateInTimeZone = new Date(
    date.toLocaleString('en-US', {
      timeZone: timezone,
    })
  )
  return format(dateInTimeZone, convertFormat)
}

/**
 * Time ago
 * @param val
 * @returns {*}
 */
// export const timeAgo = (val) => {
//   if (!val) {
//     return ''
//   }

//   let date

//   if (isNumber(val)) {
//     date = new Date(val * 1000)
//   } else {
//     date = new Date(val)
//   }

//   return distanceInWords(date, new Date(), { locale: vi })
// }

export const distanceTime = (val1, val2) => {
  if (!val1) {
    return ''
  }

  let date1

  if (isNumber(val1)) {
    date1 = new Date(val1 * 1000)
  } else {
    date1 = new Date(val1)
  }

  let date2 = new Date()
  if (val2) {
    if (isNumber(val2)) {
      date2 = new Date(val2 * 1000)
    } else {
      date2 = new Date(val2)
    }
  }

  return formatDistanceStrict(date1, date2, {
    locale: vi,
    roundingMethod: 'floor',
  })
}

/**
 * Parse time to hours and minutes
 * @param time
 * @returns {*}
 */
export const parseTime = (time) => {
  const values = (time || '').split(':')
  if (values.length >= 2) {
    const hours = parseInt(values[0], 10)
    const minutes = parseInt(values[1], 10)

    return {
      hours,
      minutes,
    }
  }

  return null
}

/**
 * Compare time
 * @param time1
 * @param time2
 * @returns {number}
 */
export const compareTime = (time1, time2) => {
  const value1 = parseTime(time1)
  const value2 = parseTime(time2)

  const minutes1 = value1.minutes + value1.hours * 60
  const minutes2 = value2.minutes + value2.hours * 60

  if (minutes1 === minutes2) {
    return 0
  }

  return minutes1 > minutes2 ? 1 : -1
}

/**
 * Format time
 * @param time
 * @returns {string}
 */
export function formatTime(time) {
  return (
    (time.hours < 10 ? '0' + time.hours : time.hours) +
    ':' +
    (time.minutes < 10 ? '0' + time.minutes : time.minutes)
  )
}

/**
 * Next time
 * @param time
 * @param step
 * @returns {string}
 */
export const nextTime = (time, step) => {
  const timeValue = parseTime(time)
  const stepValue = parseTime(step)

  const next = {
    hours: timeValue.hours,
    minutes: timeValue.minutes,
  }

  next.minutes += stepValue.minutes
  next.hours += stepValue.hours

  next.hours += Math.floor(next.minutes / 60)
  next.minutes = next.minutes % 60

  return formatTime(next)
}

/**
 * Get current unix time
 * @return {number}
 */
export const unixTime = (date) => getTime(date ? parseISO(date) : new Date())

/**
 * Get time second
 * @returns {number}
 */
export function getTimeSecondNow() {
  return Math.round(new Date().getTime() / 1000)
}

export { format }

export function timeSince(val) {
  if (!val) return 0
  const date = isNumber(val) ? new Date(val * 1000) : new Date(val)

  return new Date() - date
}
