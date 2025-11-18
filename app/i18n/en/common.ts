import { PanelChildTab, PanelTab } from '~/types/common'

export default {
  title: {
    [PanelTab.DASHBOARD]: 'Dashboard',
    [PanelTab.CARD_LIST]: 'Cards',
    [PanelTab.TRANSACTIONS]: 'Transactions',
    [PanelTab.SETTINGS]: 'Settings',
    [PanelTab.HELP]: 'Help',
    [PanelTab.CONTACT_SUPPORT]: 'Contact support',
    [PanelChildTab.CARD_ISSUE]: 'Advertising Card',
    [PanelChildTab.CARD_TYPE_SELECT]: 'Select card type',
  },
  header: {
    profile: 'Profile',
    resetPassword: 'Reset Password',
    lastReset: 'Last edit: {date}',
    logout: 'Logout',
    
  },
  toast: {
    copy: 'Copied to clipboard!',
    success: {
      topupCard: 'Successful Card Top-up',
      editCard: 'Edited card successfully',
      issueCard: 'Card issued successfully',
      generateCard:'Gen card address successful',
    },
    failed: {
      topupCard: 'Fail to Top up virtual card. Please try again',
    },
    error:'Oops! Something went wrong. Please try again.'
  },
  validator: {
    empty: {
      issueCard: {
        name: 'Card name is mandatory. Please enter your card name',
        phoneNumber: 'Phone number is mandatory. Please enter your phone number',
        email: 'Email is mandatory. Please enter your email',
        category: 'Category is mandatory. Please choose your category',
      },
      profile: {
        full_name: 'Your name is mandatory',
        phone_number: '',
        email: '',
      },
    },
    invalid: {
      issueCard: {
        name: 'Please enter only valid English characters',
        email: 'Invalid email address',
        zeroStartingBalance: 'Please enter an amount greater than 0',
        limitStartingBalance: 'The maximum amount is 999,999,999',
        insufficientBalance: 'Insufficient balance',
      },
      profile: {
        full_name: 'Please enter only valid English characters',
        email: 'Invalid email address',
      },
      topupCard: {
        zeroTopup: 'Please enter an amount greater than 0',
        limitTopup: 'The maximum amount is 999,999,999',
        insufficientBalance: 'Insufficient balance',
      },
    },
  },
}
