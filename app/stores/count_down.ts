import { defineStore } from 'pinia'
import { useCookie } from '#app'

export const useCountDownStore = defineStore('countDown', () => {
  const cookieSeconds = useCookie<number>('countdown-seconds', { default: () => 0 })
  const cookieStartTime = useCookie<number>('countdown-start-at', { default: () => 0 })
  const errorCount = useCookie<number>('errorCount', { default: () => 0 })
  const showCountDown = useCookie<Boolean>('showCountDown', { default: () => false })

  const totalSeconds = ref(0)
  let interval: ReturnType<typeof setInterval> | null = null

  function getRemainingSeconds(): number {
    const now = Math.floor(Date.now() / 1000)
    const elapsed = now - (cookieStartTime.value || 0)
    const remaining = (cookieSeconds.value || 0) - elapsed
    return Math.max(remaining, 0)
  }

  function start(seconds: number) {
    cookieSeconds.value = seconds
    cookieStartTime.value = Math.floor(Date.now() / 1000)
    totalSeconds.value = seconds
    runInterval()
  }

  function resume() {
    const remaining = getRemainingSeconds()
    if (remaining > 0) {
      totalSeconds.value = remaining
      runInterval()
    } else {
      stop()
    }
  }

  function runInterval() {
    if (interval) clearInterval(interval)
    interval = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--
      } else {
        stop()
      }
    }, 1000)
  }

  function stop() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    cookieSeconds.value = 0
    cookieStartTime.value = 0
  }

  function clear() {
    stop()
    totalSeconds.value = 0
    errorCount.value = 0
    showCountDown.value = false
  }

  return {
    errorCount,
    showCountDown,
    totalSeconds,
    start,
    resume,
    stop,
    clear,
  }
})