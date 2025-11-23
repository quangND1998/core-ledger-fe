import commonEn from './app/i18n/en/common'
import commonVi from './app/i18n/vi/common'
import dashboardEn from './app/i18n/en/dashboard'
import dashboardVi from './app/i18n/vi/dashboard'
import cardsEn from './app/i18n/en/cards'
import cardsVi from './app/i18n/vi/cards'
import transEn from './app/i18n/en/transactions'
import transVi from './app/i18n/vi/transactions'
import profileEn from './app/i18n/en/profile'
import profileVi from './app/i18n/vi/profile'
import authEn from './app/i18n/en/auth'
import authVi from './app/i18n/vi/auth'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    defaultLocale: 'en',
    messages: {
      en: {
        dashboard: dashboardEn,
        common: commonEn,
        cards: cardsEn,
        transactions: transEn,
        profile: profileEn,
        auth: authEn,
      },
      vi: {
        dashboard: dashboardVi,
        common: commonVi,
        cards: cardsVi,
        transactions: transVi,
        profile: profileVi,
        auth: authVi,
      },
    },
  }
})
