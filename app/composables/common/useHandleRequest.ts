import { ref, type UnwrapRef } from 'vue'

export function useHandleRequest<T>(request: (...args: any[]) => Promise<T | undefined>, timeout = 0) {
  const isLoading = ref<boolean>(false)
  const error = ref<any>(undefined)
  const data = ref<T | undefined>(undefined)

  const handleRequest = async (...args: any[]): Promise<T | undefined> => {
    if (isLoading.value) return
    try {
      isLoading.value = true
      error.value = undefined
      const res = await request(...args)
      data.value = res as UnwrapRef<T>
      return res
    } catch (error: any) {
      error.value = error
    } finally {
      if (timeout > 0) {
        const timer = setTimeout(() => {
          isLoading.value = false
          clearTimeout(timer)
        }, timeout)
      } else {
        isLoading.value = false
      }
    }
  }

  return {
    isLoading,
    error,
    data,
    handleRequest,
  }
}
