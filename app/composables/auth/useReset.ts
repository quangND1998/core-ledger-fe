import { validatePassword, validateConfirmPassword } from '~/utils/validator.util'

interface ResetFields {
  pin: string
  password: string
  confirmPassword: string
}

interface ResetErrors {
  pin: string | undefined
  password: string | undefined
  confirmPassword: string | undefined
}

export const useReset = () => {
  const { t } = useI18n()
  const { profile } = useProfileStore()
  const router = useRouter()
  const step = ref<1 | 2 | 3>(1)
  const toast = useToast()

  const fields = ref<ResetFields>({
    pin: '',
    password: '',
    confirmPassword: '',
  })

  const errors = ref<ResetErrors>({
    pin: undefined,
    password: undefined,
    confirmPassword: undefined,
  })

  const back = () => {
    switch (step.value) {
      case 1:
        router.push('/auth/sign-in')
        break
      case 2:
      case 3:
        step.value -= 1
        break
      default:
        break
    }
  }

  const next = () => {
    switch (step.value) {
      case 1:
        step.value += 1
        break
      case 2:
        toast.add({
          title: 'Password changed successfully',
          timeout: 5000,
        })
        router.push('/auth/sign-in')
        break
      default:
        break
    }
  }

  const onCompletedPin = (pin: string) => {
    fields.value.pin = pin
    next()
  }

  const isValidate = computed(
    () =>
      fields.value.password &&
      fields.value.confirmPassword &&
      fields.value.password == fields.value.confirmPassword &&
      !errors.value.password &&
      !errors.value.confirmPassword,
  )

  watch(
    () => fields.value.password,
    () => {
      if (errors.value.confirmPassword) {
        errors.value.confirmPassword = validateConfirmPassword(fields.value.confirmPassword, fields.value.password, t)
      }
      errors.value.password = validatePassword(fields.value.password, t)
    },
  )

  watch(
    () => fields.value.confirmPassword,
    () => {
      if (errors.value.password) {
        errors.value.password = validatePassword(fields.value.password, t)
      }
      errors.value.confirmPassword = validateConfirmPassword(fields.value.confirmPassword, fields.value.password, t)
    },
  )

  return { step, back, next, isValidate, profile, onCompletedPin, fields, errors }
}
