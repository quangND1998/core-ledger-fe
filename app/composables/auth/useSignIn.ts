import { CommonLogger } from '~/common/logger'
import { useHandleRequest } from '../common/useHandleRequest'
import { showToast, ToastType } from '~/common/functions'

interface SignInFields {
  email: string
  password: string
}

interface SignInFieldErrors {
  email: string | undefined
  password: string | undefined
}

export const useSignIn = () => {
  const { t } = useI18n()
  const { login } = useAuthStore()
  const { fetchProfile } = useProfileStore()
  const router = useRouter()

  const fields = ref<SignInFields>({
    email: '',
    password: '',
  })

  const errors = ref<SignInFieldErrors>({
    email: undefined,
    password: undefined,
  })

  const { isLoading, handleRequest } = useHandleRequest(async () => {
      const result = await login(fields.value,t)
      if (result.success){
        await fetchProfile()
        router.push('/')
      }else{
        showToast(ToastType.FAILED,result.message)
        return
      }
  })

  const isValidate = computed(
    () =>
      !isLoading.value &&
      fields.value.email &&
      fields.value.password &&
      !errors.value.email &&
      !errors.value.password,
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
      errors.value.password = validatePassword(fields.value.password)
    },
  )

  return { fields, errors, isLoading, isValidate, login: handleRequest }
}
