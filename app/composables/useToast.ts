import { toast } from 'vue-sonner'

export enum ToastType {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export function useAppToast() {
  const showToast = (type: ToastType, title: string) => {
    if (type === ToastType.SUCCESS) {
      toast.success(title, {
        duration: 5000,
      })
    } else {
      toast.error(title, {
        duration: 5000,
      })
    }
  }

  return {
    showToast,
  }
}

