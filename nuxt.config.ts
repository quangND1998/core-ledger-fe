// https://nuxt.com/docs/api/configuration/nuxt-config
import { CommonLanguage } from './app/types/common'
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],
  runtimeConfig: {
    private: {
      baseUrl: process.env.BASE_URL,
    },
    public: {
      baseUrl: process.env.BASE_URL,
      appName: process.env.APP_NAME || 'Core-Ledger'

    },
    app: {
      auth: {
        api: {
          baseUrl: process.env.BASE_URL,
        },
        pages: {
          home: '/',
          signIn: '/auth/login',
        },
        accessToken: {
          maxAgeInSeconds: 1000,
          sameSiteAttribute: true,
        },
        refreshToken: {
          maxAgeInSeconds: 1000,
          sameSiteAttribute: true,
        },
        session: {
          enableRefreshOnWindowFocus: false,
        },
        globalAppMiddleware: false,
      },
    },
  },
  modules: [
    '@nuxt/ui',
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    '@nuxtjs/i18n',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    'nuxt-aos',
    '@nuxtjs/seo',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vee-validate/nuxt',
    'dayjs-nuxt',
    '@pinia/nuxt',
  ],
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  },
  plugins: [
    '~/plugins/auth.plugin',
    '~/plugins/element-plus.plugin',
    '~/plugins/apexcharts.ts'],

  i18n: {
    vueI18n: '~/i18n.config.ts',
    locales: [CommonLanguage.EN, CommonLanguage.VI], // used in URL path prefix
    defaultLocale: CommonLanguage.EN, // default locale of your project for Nuxt pages and routings,
    lazy: true,
    skipSettingLocaleOnNavigate: true,
    detectBrowserLanguage: false,
  },

  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
  },

  pinia: {
    storesDirs: ['./app/stores/**', './custom-folder/stores/**'],
  },

  vite: {
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.error', 'console.warn', 'console.debug', 'console.trace'],
    },
  },


  aos: {
    duration: 600,
  },

  colorMode: {
    preference: 'light',
  },

  // Change to Wealify
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {

          name: 'description',
          content: 'Wealify',
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'Wealify' },
        { property: 'og:site_name', content: 'Wealify' },
        { property: 'og:title', content: 'Wealify' },
        {
          property: 'og:description',
          content: 'Wealify',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://Wealify.com' },
        { property: 'og:image', content: '/favicon.ico' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'Wealify',
        },
        {
          name: 'twitter:description',
          content: 'Wealify',
        },
        { name: 'twitter:site', content: 'https://Wealify.com' },
        {
          name: 'twitter:image',
          content: 'https://Wealify.com/social-card.png',
        },
        {
          name: 'twitter:image:src',
          content: 'https://Wealify.com/social-card.png',
        },
        {
          name: 'keywords',
          content: 'Wealify',
        },
        { property: 'og:type', content: 'website' },
        {

          property: 'og:title',
          content: 'Wealify',
        },
        {

          property: 'og:description',
          content: 'Wealify',
        },
        {

          property: 'og:image',
          content: 'https://Wealify.com/social-card.png',
        },
        {

          property: 'og:url',
          content: 'https://Wealify.com/social-card.png',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Inter:500|Manrope:600|Space+Grotesk:500,600&display=swap',
        },
        { rel: 'canonical', href: 'https://Wealify.com' },
        { rel: 'alternate', hreflang: 'en', href: 'https://Wealify.com' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://Wealify.com' },
      ],
    },
  },

  robots: {
    blockNonSeoBots: true,
    blockAiBots: true,
  },

  site: {
    url: 'https://www.wealify.com',
    name: '',
  },

  schemaOrg: {
    defaults: false,
  },


})