import { CardCategory, CardStatus, CardType } from '~/types/cards'
import { CommonCountry } from '~/types/common'
export default {
  button: {
    withdraw: 'Withdraw',
    issue: 'Issue card',
    topup: 'Top-up',
    freeze: 'Freeze',
    unfreeze: 'Unfreeze',
    cancel: 'Cancel cards',
    topupCard: 'Top up card',
    editCard: 'Save',
  },
  filter: {
    placeholder: {
      search: 'Search card number, card name, or last 4 digits',
    },
    label: {
      type: 'Type',
      category: 'Category',
      status: 'Status',
      total: 'Total: ${amount}',
      amount: '{active}/{total} cards',
      amountSelected: '{selected}/{total} selected cards',
    },
  },
  list: {
    card_number: 'xxxx xxxx xxxx {value}',
    type: {
      [CardType.VIRTUAL]: 'Ads Card',
      [CardType.PHYSICAL]: 'Purchase Card',
    },

    status: {
      [CardStatus.ACTIVE]: 'Active',
      [CardStatus.CANCELLED]: 'Cancel',
      [CardStatus.FROZEN]: 'Freeze',
    },

    category: {
      [CardCategory.ENTERTAINMENT]: 'Entertainment',
      [CardCategory.INVESTMENT_DIVIDEND]: 'Investment / Dividend',
      [CardCategory.FOOD_BEVERAGES]: 'Food & Beverages',
      [CardCategory.GOVERNMENT_SERVICES]: 'Government Services',
      [CardCategory.INVENTORY]: 'Inventory',
      [CardCategory.MARKETING]: 'Marketing',
      [CardCategory.OFFICE]: 'Office',
      [CardCategory.SALARY]: 'Salary',
      [CardCategory.SOFTWARE]: 'Software',
      [CardCategory.RETAIL]: 'Retail',
      [CardCategory.SALES]: 'Sales',
      [CardCategory.SERVICE_PROVIDER]: 'Service Provider',
      [CardCategory.TRAVEL]: 'Travel',
      [CardCategory.UTILITIES]: 'Utilities',
      [CardCategory.OTHER]: 'Other',
      [CardCategory.EQUIPMENT]: 'Equipment',
      [CardCategory.TAXES]: 'Taxes',
      [CardCategory.API_PAYMENTS]: 'API Payments',
      [CardCategory.CLIMATE_CHANGE]: 'Climate Change',
      [CardCategory.FOOD]: 'Food',
      [CardCategory.ADS_SERVICE]: 'Ads Service',
    },
    empty: 'No card created yet',
    pagination: {
      limit: '{limit} lines/page',
    },
    header: {
      card: 'Card',
      type: 'Type',
      category: 'Category',
      balance: 'Card Balance',
      total_top_up: 'Total Top-up',
      total_withdraw: 'Total Withdraw',
      created_at: 'Create Date',
      status: 'Status',
      action: 'Action',
    },
  },
  issue: {
    info: {
      title: 'Card information',
      form: {
        country: {
          [CommonCountry.INDONESIA]: 'Indonesia',
          [CommonCountry.MYANMAR]: 'Myanmar',
          [CommonCountry.THAILAND]: 'Thailand',
          [CommonCountry.VIETNAM]: 'Vietnam',
          [CommonCountry.MALAYSIA]: 'Malaysia',
          [CommonCountry.PHILIPPINES]: 'Philippines',
          [CommonCountry.LAOS]: 'Laos',
          [CommonCountry.CAMBODIA]: 'Cambodia',
          [CommonCountry.EAST_TIMOR]: 'East Timor',
          [CommonCountry.BRUNEI]: 'Brunei',
          [CommonCountry.SINGAPORE]: 'Singapore',
        },
        label: {
          name: 'Card name',
          email: 'Email',
          phoneNumber: 'Phone number',
          category: 'Card category',
          purpose: 'Card purpose',
        },
        placeholder: {
          name: 'Enter your card name',
          email: `Enter cardholder's email`,
          phoneNumber: `E.g. 0901234567 or +84901234567`,
          category: 'Choose card category',
          purpose: 'Enter your card purpose',
        },
      },
    },
    balance: {
      title: 'Balance',
      form: {
        starting: 'Starting balance of the card',
        availableCard: 'Card Balance: {amount} USD',
        availableWealify: 'Wealify Balance: {amount} USD',
      },
    },
    preview: {
      title: 'Card preview',
      namePlaceholder: 'Card holder name',
      fee: 'Issue card fee',
      starting: 'Starting balance of the card',
      total_top_up: 'Top up amount',
      button: 'Issue card',
    },
    policy: 'I agree with Terms of Use and Policy',
    notification: {
      title: 'Notification',
      failed: 'Failed to issue a new card. Please try again later',
      limit: 'You have reached the maximum number of cards created. Please contact sales for more supports',
      process: {
        title: 'Processing',
        description: `We're proccessing your request. One moment please`,
      },
    },
  },
  slideovers: {
    detail: {
      label: 'Card detail',
      info: {
        card_number: 'Card number',
        CVV: 'CVV',
        expired: 'Expired date',
        cardBalance: 'Card balance',
        purpose: 'Card purpose',
        total_top_up: 'Total Top-up',
        total_withdraw: 'Total Withdraw',
        balance: 'Balance',
      },
      analysis:{
        tilte:'Cash-out Report'
      },
      button: {
        transaction: 'View Transaction',
        viewInfo: 'View card information',
        topup: 'Top-Up',
        freeze: 'Freeze',
        cancel: 'Cancel',
        withdraw: 'Withdraw',
        unfreeze: 'Unfreeze',
      },
    },
  },
  message: {
    freeze: {
      success:
        'The card is frozen. You will not be able to perform any actions on this card, including making transactions',
      error: 'Fail to Freeze card. Please contact Wealify supports',
    },
    cancel: {
      success: 'cancel card success !',
      error: 'Fail to Cancel card. Please contact Wealify supports.',
    },
    unfreeze: {
      success: 'Card is unfrozen and you can continue to make card transactions',
      error: 'Fail to Unfreeze card. Please contact Wealify supports',
    },
  },
  modals: {
    otp: {
      title: 'OTP',
      description: 'Please enter the verification code sent to ',
      timeout: 'Your verification code will expire in ',
      notReceived: 'Did not receive OTP? ',
      resend: 'Resend OTP in ',
      message:'The OTP you entered is invalid or expired. You only have {count} attempts left',
      max_attemp:'You have reached the maximum fail attempts. Please try again after 30 minutes',
      button:{
        resend:'Resend',
        try_again:'Try again',
      }
    },
    topup: {
      title: 'Top up card',
      label: {
        balance: 'Wealify Balance:',
        select: 'Top up card:',
        amount: 'Your amount',
        fee: 'Fee',
        topup: 'Top up amount',
      },
      getAddressesPrompt:"Get card's wallet addresses to start top up coin directly to your Wealify Virtual Card",
      getAddressesButton:"Get wallet addresses",
    },
    freeze: {
      title: 'Freeze this card',
      message: 'The card will be temporarily unusable until you unfreeze it again. Are you sure you want to proceed?',
      label: {
        cancel: 'Cancel',
        confirm: 'Freeze card',
      },
    },
    cancel: {
      title: 'Cancel this card?',
      message:
        'Wealify will cancel this card and you cannot use it to make payment. Your remaining balance will be automatically refunded to your Wealify account.',
      label: {
        cancel: 'Back',
        confirm: 'Cancel',
      },
    },
    unfreeze: {
      title: 'Unfreeze the card',
      message: 'This card will be reactivated and ready for use. Are you sure you want to continue?',
      label: {
        cancel: 'Cancel',
        confirm: 'Unfreeze',
      },
    },
    edit: {
      title: 'Edit card',
      label: {
        cardName: 'Card name',
        email: 'Email',
        phoneNumber: 'Phone number',
        category: 'Card category',
        purpose: 'Card purpose',
      },
      placeholder: {
        name: 'Enter your card name',
        email: `Enter cardholder's email`,
        phoneNumber: `Enter cardholder's phone number`,
        category: 'Choose card category',
        purpose: 'Enter your card purpose',
      },
    },
  },
}
