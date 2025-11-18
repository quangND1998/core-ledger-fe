interface ForgotFields {
  email: string
  pin: string
  password: string
  confirmPassword: string
}

interface ForgotErrors {
  email: string | undefined
  pin: string | undefined
  password: string | undefined
  confirmPassword: string | undefined
}

export const useForgot = () => {
  const router = useRouter()
  const step = ref<1 | 2 | 3>(1)
  const toast = useToast()

  const fields = ref<ForgotFields>({
    email: '',
    pin: '',
    password: '',
    confirmPassword: '',
  })

  const errors = ref<ForgotErrors>({
    email: undefined,
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
      case 2:
        step.value += 1
        break
      case 3:
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
      fields.value.email &&
      fields.value.password &&
      fields.value.confirmPassword &&
      fields.value.password == fields.value.confirmPassword &&
      !errors.value.email &&
      !errors.value.password &&
      !errors.value.confirmPassword,
  )

  watch(
    () => fields.value.email,
    () => {
      errors.value.email = validateEmail(fields.value.email)
    },
  )

  watch(
    () => fields.value.password,
    () => {
      if (errors.value.confirmPassword) {
        errors.value.confirmPassword = validateConfirmPassword(fields.value.confirmPassword, fields.value.password)
      }
      errors.value.password = validatePassword(fields.value.password)
    },
  )

  watch(
    () => fields.value.confirmPassword,
    () => {
      if (errors.value.password) {
        errors.value.password = validatePassword(fields.value.password)
      }
      errors.value.confirmPassword = validateConfirmPassword(fields.value.confirmPassword, fields.value.password)
    },
  )

  return { step, back, next, isValidate, onCompletedPin, fields, errors }
}
