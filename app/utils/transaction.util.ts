import { TransactionVCStatus } from '~/types/transactions'

export function getStatusColor(status: TransactionVCStatus) {
  if (status === TransactionVCStatus.FAILURE) {
    return {
      color: '#ED2C38',
      background: '#FFE3EF',
    }
  }
  if (status === TransactionVCStatus.SUCCESS) {
    return {
      color: '#2EA518',
      background: '#EBF6EE',
    }
  }
  if (status === TransactionVCStatus.PROCESSING) {
    return {
      color: '#02076F',
      background: '#EDEDFD',
    }
  }
  if (status === TransactionVCStatus.PENDING) {
    return {
      color: '#FDA707',
      background: '#FFEFD0',
    }
  }
  if (status === TransactionVCStatus.CANCEL) {
    return {
      color: '#ED2C38',
      background: '#FFE3EF',
    }
  }
}

export function getBanner(status: TransactionVCStatus) {
  if (status === TransactionVCStatus.FAILURE) {
    return '/images/transactions/failure.svg'
  }
  if (status === TransactionVCStatus.SUCCESS) {
    return '/images/transactions/success.svg'
  }
  if (status === TransactionVCStatus.PROCESSING) {
    return '/images/transactions/pending.svg'
  }
  if (status === TransactionVCStatus.PENDING) {
    return '/images/transactions/pending.svg'
  }
  if (status === TransactionVCStatus.CANCEL) {
    return '/images/transactions/cancel.svg'
  }
}

export function getStatusText(status: TransactionVCStatus) {
  if (status === TransactionVCStatus.FAILURE) {
    return 'Failed at'
  }
  if (status === TransactionVCStatus.SUCCESS) {
    return 'Success at'
  }
  if (status === TransactionVCStatus.PROCESSING) {
    return 'Processing at'
  }
  if (status === TransactionVCStatus.PENDING) {
    return 'Success at'
  }
  if (status === TransactionVCStatus.CANCEL) {
    return 'Cancelled at'
  }
}
