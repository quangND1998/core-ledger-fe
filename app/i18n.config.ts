import commonEn from './i18n/en/common'
import commonVi from './i18n/vi/common'
import dashboardEn from './i18n/en/dashboard'
import dashboardVi from './i18n/vi/dashboard'
import profileEn from './i18n/en/profile'
import profileVi from './i18n/vi/profile'
import authEn from '~/i18n/en/auth'
import authVi from '~/i18n/vi/auth'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    defaultLocale: 'en',
    messages: {
      en: {
        dashboard: dashboardEn,
        common: commonEn,
        profile: profileEn,
        auth: authEn,
      },
      vi: {
        dashboard: dashboardVi,
        common: commonVi,
        profile: profileVi,
        auth: authVi,
      },
    },
  }
})
