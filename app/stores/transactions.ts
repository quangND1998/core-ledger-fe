import { TransactionService } from '~/services/transactions.service'
import { HTTP_STATUS_CODE } from '~/types/common'
import {
  type ITransactionData,
  type IGetTransactionListParams,
  TransactionVCType,
  TransactionDetailType,
} from '~/types/transactions'

export const useTransactionStore = defineStore('transaction', () => {
  const transactionCount = ref(0)

  const isLoading = ref({
    transactionTable: false,
  })

  const { t } = useI18n()

  const payload = ref<IGetTransactionListParams>({
    page: 1,
    limit: 10,
    keyword: undefined,
    transaction_type: undefined,
    transaction_status: undefined,
    start_date: undefined,
    end_date: undefined,
    dataSort: undefined,
  })

  function setPayload(_payload: IGetTransactionListParams) {
    payload.value = { ..._payload }
  }

  function setPayloadPage(page: number) {
    payload.value.page = page
  }

  const selectedTransactionDetail = ref<ITransactionData>()

  function setSelectedTransactionDetail(transaction: ITransactionData) {
    const cardInfo = transaction.virtual_card
    const type = transaction.transaction_vc_type
    const transactionType = transaction.vc_detail_transaction_type
    let detailType
    
    if (cardInfo && type === TransactionVCType.TOP_UP) {
      if (transaction.is_issue){
        detailType = TransactionDetailType.CARD_ISSUE_TOPUP
      }else{
        if (transactionType == TransactionDetailType.WALLET_REFUND){          
          detailType = TransactionDetailType.WALLET_REFUND
        }else if(transactionType == TransactionDetailType.CARD_CRYPTO_TOP_UP){
          detailType = TransactionDetailType.CARD_CRYPTO_TOP_UP
        }else{
          detailType = TransactionDetailType.CARD_TOP_UP
        }
      }
    }

    if (cardInfo && type === TransactionVCType.WITHDRAWAL) {
      if (transactionType == TransactionDetailType.WALLET_WITHDRAW){
        detailType = TransactionDetailType.WALLET_WITHDRAW
      }else if (transactionType == TransactionDetailType.WALLET_ISSUE_WITHDRAW){
        detailType = TransactionDetailType.WALLET_ISSUE_WITHDRAW
      } else{
        detailType = TransactionDetailType.CARD_WITHDRAW
      }
    }

    if (cardInfo && type === TransactionVCType.PAYMENT) {
      detailType = TransactionDetailType.CARD_PAYMENT
    }

    if (cardInfo && type === TransactionVCType.REFUND) {
      detailType = TransactionDetailType.CARD_REFUND
    }

    if (!cardInfo && type === TransactionVCType.TOP_UP) { // ví nạp tiền vào
      detailType = TransactionDetailType.WALLET_TOP_UP
    }

    if (!cardInfo && type === TransactionVCType.WITHDRAWAL) {
      if (transaction.is_issue){
        detailType = TransactionDetailType.WALLET_ISSUE_WITHDRAW
      }else{
        detailType = TransactionDetailType.WALLET_WITHDRAW
      }
    }


    selectedTransactionDetail.value = { ...transaction, detailType: detailType }
  }

  const isOpenTransactionDetailSlideover = ref(false)

  function toggleTransactionDetailSlideover(state: boolean) {
    isOpenTransactionDetailSlideover.value = state
  }

  const transactionList = ref<ITransactionData[]>([])

  async function getTransactionList(payload: IGetTransactionListParams) {
    isLoading.value.transactionTable = true
    payload.exclude_vc_detail_transaction_types = "WALLET_WITHDRAW_BANK"
    try {
      const response = await TransactionService.instance.getTransactionList(payload)
      if (response.code == HTTP_STATUS_CODE.OK) {
        transactionList.value = response.data.items || []
        transactionCount.value = response.data.total_items
      } else {
        throw new Error(response.message ?? 'Can not get transactions')
      }
      return response
    } catch (error) {
      transactionList.value = []
    } finally {
      isLoading.value.transactionTable = false
    }
  }

  async function getTransaction(id:string) {
    let result = {
      success: true
    }
    const response = await TransactionService.instance.getTransaction(id)
    if (response.success) {
      selectedTransactionDetail.value = response.data
      return {
        ...result,
        transaction: response.data
      }
    }
    return {
      success: false,
      message: response.message ||  t('common.toast.error')
    }
  }

  return {
    payload,
    setPayload,
    setPayloadPage,
    transactionList,
    transactionCount,
    getTransactionList,
    isOpenTransactionDetailSlideover,
    toggleTransactionDetailSlideover,
    selectedTransactionDetail,
    setSelectedTransactionDetail,
    isLoading,
    getTransaction,
  }
})
