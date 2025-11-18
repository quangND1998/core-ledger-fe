export const useCountdown = (target: string | Date | number, onComplete?: () => void) => {
  const currentTime = ref<number>(Date.now())
  let intervalId: NodeJS.Timeout | undefined

  // Compute target timestamp
  const targetTimestamp = computed<number>(() => {
    if (typeof target === 'number') {
      return currentTime.value + target * 1000 // Seconds from now
    }
    return new Date(target).getTime() // Specific date
  })

  // Remaining seconds
  const time = computed<number>(() => {
    const diff = targetTimestamp.value - currentTime.value
    return diff > 0 ? Math.floor(diff / 1000) : 0
  })

  // Check completion
  const triggerComplete = () => {
    if (time.value === 0 && onComplete) {
      onComplete()
    }
  }

  // Start timer
  onMounted(() => {
    intervalId = setInterval(() => {
      currentTime.value = Date.now()
      triggerComplete()
    }, 1000)
  })

  // Cleanup timer
  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId)
    }
  })

  return { time }
}
