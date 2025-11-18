

export enum CommonLanguage {
  VI = 'vi',
  EN = 'en',
}

export enum PanelTab {
  DASHBOARD = 'DASHBOARD',
  CARD_LIST = 'CARD_LIST',
  TRANSACTIONS = 'TRANSACTIONS',
  SETTINGS = 'SETTINGS',
  HELP = 'HELP',
  CONTACT_SUPPORT = 'CONTACT_SUPPORT',
}

export enum PanelChildTab {
  CARD_ISSUE = 'CARD_ISSUE',
  CARD_TYPE_SELECT = 'CARD_TYPE_SELECT',
}

export interface IPanelTab {
  value: PanelTab
  label: string
  to: string
  active: boolean
}

export enum CommonCurrency {
  USD = 'USD',
}

export enum CommonUSDTNetwork {
  AVAXC = 'AVAX-C',
  BSC = 'BEP-20',
  ERC20 = 'ERC-20',
  SOL = 'SOL',
  TRC20 = 'TRC-20',
}

export enum CommonCountry {
  INDONESIA = 'ID',
  MYANMAR = 'MM',
  THAILAND = 'TH',
  VIETNAM = 'VN',
  MALAYSIA = 'MY',
  PHILIPPINES = 'PH',
  LAOS = 'LA',
  CAMBODIA = 'KH',
  EAST_TIMOR = 'TL',
  BRUNEI = 'BN',
  SINGAPORE = 'SG',
}

export enum HTTP_STATUS_CODE {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLYHINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED = 421,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

export interface ICommonResponse<T> {
  code: HTTP_STATUS_CODE
  data: T
  message: string
  success: boolean
}

export interface ICommonListResponse<T> {
  code: HTTP_STATUS_CODE
  data: {
    items: T[]
    limit: number
    page: number
    total_items: number
    total_page: number
    total_active: number
    total_created: number
    total_balance: number
  }
  message: string
  success: boolean
}

// Dropdowns
export interface IDropdownCardData {
  card_name: string
  id: string
  last_four: string
  balance: number
}

export enum FeeType {
  TOP_UP_CARD = 'TOP_UP_CARD',
  ISSUE_CARD = 'ISSUE_CARD',
  WITHDRAWAL_CARD = 'WITHDRAWAL_CARD',
  TOP_UP_WALLET = 'TOP_UP_WALLET',
}

export enum FeeAmountType {
  FIXED = 'FIXED',
  PERCENT = 'PERCENT',
}

export enum FeeKey {
  ISSUE_CARD = 'ISSUE_CARD',
  TOP_UP_CARD = 'TOP_UP_CARD',
  TOP_UP_WALLET = 'TOP_UP_WALLET',
  WITHDRAWAL_CARD = 'WITHDRAWAL_CARD',
}
export interface FeeDetail {
  type: FeeAmountType
  value: number
}

export type Fees = Record<FeeKey, FeeDetail>
