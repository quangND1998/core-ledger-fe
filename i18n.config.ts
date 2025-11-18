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


import { CommonLanguage } from './app/types/common'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: CommonLanguage.EN,
  defaultLocale: CommonLanguage.EN,
  messages: {
    en: {
      dashboard: dashboardEn,
      common: commonEn,
      cards: cardsEn,
      transactions: transEn,
      profile: profileEn,
    },
    vi: {
      dashboard: dashboardVi,
      common: commonVi,
      cards: cardsVi,
      profile: profileVi,
    },
  },
}))
