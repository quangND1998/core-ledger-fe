<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true,
  },
})

const { fields, errors, isLoading, isValidate, login } = useSignIn()
const { t } = useI18n()

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (isValidate.value) {
    await login()
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {{ t('auth.login.title') || 'Sign in to your account' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ t('auth.login.subtitle') || 'Enter your credentials to access your account' }}
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit="handleSubmit">
        <div class="space-y-4 rounded-md shadow-sm">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('auth.login.email') || 'Email' }}
            </label>
            <div class="relative">
              <Input
                id="email"
                v-model="fields.email"
                type="email"
                autocomplete="email"
                :placeholder="t('auth.login.emailPlaceholder') || 'Enter your email'"
                :class="[
                  'w-full',
                  errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300',
                ]"
                :disabled="isLoading"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('auth.login.password') || 'Password' }}
            </label>
            <div class="relative">
              <Input
                id="password"
                v-model="fields.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                :placeholder="t('auth.login.passwordPlaceholder') || 'Enter your password'"
                :class="[
                  'w-full pr-10',
                  errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300',
                ]"
                :disabled="isLoading"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                :aria-label="showPassword ? t('auth.login.hidePassword') || 'Hide password' : t('auth.login.showPassword') || 'Show password'"
                @click="togglePasswordVisibility"
              >
                <img
                  v-if="showPassword"
                  src="~/assets/img/common/eye-disabled.svg"
                  :alt="t('auth.login.hidePassword') || 'Hide password'"
                  class="h-5 w-5"
                />
                <img
                  v-else
                  src="~/assets/img/common/eye.svg"
                  :alt="t('auth.login.showPassword') || 'Show password'"
                  class="h-5 w-5"
                />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            :disabled="!isValidate || isLoading"
            class="w-full"
            :class="{
              'opacity-50 cursor-not-allowed': !isValidate || isLoading,
            }"
          >
            <span v-if="isLoading">{{ t('auth.login.loading') || 'Signing in...' }}</span>
            <span v-else>{{ t('auth.login.button') || 'Sign in' }}</span>
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

