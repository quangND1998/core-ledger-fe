import { CardCategory, CardStatus } from '~/types/cards'
export default {
  button: {
    withdraw: 'Withdraw',
    issue: 'Issue',
    topup: 'Top-up',
  },
  filter: {
    label: {
      type: 'Type',
      category: 'Category',
      status: 'Status',
      total: 'Total: ',
      amount: '{active}/{total} cards',
    },
  },
  list: {
    empty: 'No card created yet',
    pagination: {
      limit: '{limit} lines/page',
    },
    header: {
      card: 'Card',
      type: 'Type',
      category: 'Category',
      balance: 'Balance',
      total_top_up: 'Total Top-up',
      total_withdraw: 'Total Spend',
      created_at: 'Create Date',
      status: 'Status',
      action: 'Action',
    },
    category: {
      [CardCategory.INVESTMENT]: 'Investment/Dividend',
      [CardCategory.TRAVEL]: 'Travel',
      [CardCategory.UTILITIES]: 'Utilities',
      [CardCategory.SOFTWARE]: 'Software',
      [CardCategory.MARKETING]: 'Marketing',
      [CardCategory.SALES]: 'Sales',
      [CardCategory.OTHER]: 'Other',
    },
    status: {
      [CardStatus.ACTIVE]: 'Active',
      [CardStatus.CANCELLED]: 'Cancel',
      [CardStatus.FROZEN]: 'Freeze',
    },
  },
  message: {
    freeze: 'Freeze card success !',
    cancel: 'Cancel card success !',
    unfreeze: 'Unfreeze card success !',
  },
}
