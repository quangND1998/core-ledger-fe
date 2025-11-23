import { PanelChildTab, PanelTab } from '~/types/common'

export default {
  title: {
    [PanelTab.DASHBOARD]: 'Bảng điều khiển',
    [PanelTab.CARD_LIST]: 'Thẻ',
    [PanelTab.TRANSACTIONS]: 'Giao dịch',
    [PanelTab.SETTINGS]: 'Cài đặt',
    [PanelTab.HELP]: 'Trợ giúp',
    [PanelTab.CONTACT_SUPPORT]: 'Liên hệ hỗ trợ',
    [PanelChildTab.CARD_ISSUE]: 'Thẻ quảng cáo',
    [PanelChildTab.CARD_TYPE_SELECT]: 'Chọn loại thẻ',
  },
  header: {
    profile: 'Hồ sơ',
    resetPassword: 'Đặt lại mật khẩu',
    lastReset: 'Chỉnh sửa lần cuối: {date}',
    logout: 'Đăng xuất',
  },
  toast: {
    copy: 'Đã sao chép vào clipboard!',
    success: {
      topupCard: 'Nạp tiền thẻ thành công',
      editCard: 'Chỉnh sửa thẻ thành công',
      issueCard: 'Phát hành thẻ thành công',
      generateCard: 'Tạo địa chỉ thẻ thành công',
    },
    failed: {
      topupCard: 'Nạp tiền thẻ ảo thất bại. Vui lòng thử lại',
    },
    error: 'Ồ! Đã xảy ra lỗi. Vui lòng thử lại.',
  },
  validator: {
    empty: {
      issueCard: {
        name: 'Tên thẻ là bắt buộc. Vui lòng nhập tên thẻ của bạn',
        phoneNumber: 'Số điện thoại là bắt buộc. Vui lòng nhập số điện thoại của bạn',
        email: 'Email là bắt buộc. Vui lòng nhập email của bạn',
        category: 'Danh mục là bắt buộc. Vui lòng chọn danh mục của bạn',
      },
      profile: {
        full_name: 'Tên của bạn là bắt buộc',
        phone_number: '',
        email: '',
      },
    },
    invalid: {
      issueCard: {
        name: 'Vui lòng chỉ nhập các ký tự tiếng Anh hợp lệ',
        email: 'Địa chỉ email không hợp lệ',
        zeroStartingBalance: 'Vui lòng nhập số tiền lớn hơn 0',
        limitStartingBalance: 'Số tiền tối đa là 999,999,999',
        insufficientBalance: 'Số dư không đủ',
      },
      profile: {
        full_name: 'Vui lòng chỉ nhập các ký tự tiếng Anh hợp lệ',
        email: 'Địa chỉ email không hợp lệ',
      },
      topupCard: {
        zeroTopup: 'Vui lòng nhập số tiền lớn hơn 0',
        limitTopup: 'Số tiền tối đa là 999,999,999',
        insufficientBalance: 'Số dư không đủ',
      },
    },
  },
}
