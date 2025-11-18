import { PanelTab } from '~/types/common'

export default {
  title: {
    [PanelTab.DASHBOARD]: 'Dashboard',
    [PanelTab.CARD_LIST]: 'Cards',
    [PanelTab.TRANSACTIONS]: 'Transactions',
    [PanelTab.SETTINGS]: 'Settings',
    [PanelTab.HELP]: 'Help',
    [PanelTab.CONTACT_SUPPORT]: 'Contact support',
  },
  toast: {
    copy: 'Copied to clipboard!'
  }
}
