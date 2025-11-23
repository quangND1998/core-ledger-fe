export default {
  login: {
    title: 'Đăng nhập vào tài khoản',
    subtitle: 'Nhập thông tin đăng nhập để truy cập tài khoản',
    email: 'Email',
    password: 'Mật khẩu',
    emailPlaceholder: 'Nhập email của bạn',
    passwordPlaceholder: 'Nhập mật khẩu của bạn',
    button: 'Đăng nhập',
    loading: 'Đang đăng nhập...',
    success: 'Đăng nhập thành công',
    failed: 'Đăng nhập thất bại',
    showPassword: 'Hiển thị mật khẩu',
    hidePassword: 'Ẩn mật khẩu',
    validation: {
      emailRequired: 'Email là bắt buộc. Vui lòng nhập email của bạn.',
      emailInvalid: 'Email không hợp lệ',
      passwordRequired: 'Mật khẩu là bắt buộc. Vui lòng nhập mật khẩu của bạn',
      passwordInvalid: 'Mật khẩu phải có ít nhất 8 - 16 ký tự, bao gồm chữ hoa, chữ thường, số, ký tự đặc biệt và không chứa khoảng trắng',
    },
  },
  logout: {
    success: 'Đăng xuất thành công',
    failed: 'Đăng xuất thất bại',
    button: 'Đăng xuất',
    confirm: 'Bạn có chắc chắn muốn đăng xuất?',
  },
  validation: {
    emailRequired: 'Email là bắt buộc. Vui lòng nhập email của bạn.',
    emailInvalid: 'Email không hợp lệ',
    passwordRequired: 'Mật khẩu là bắt buộc. Vui lòng nhập mật khẩu của bạn',
    passwordInvalid: 'Mật khẩu phải có ít nhất 8 - 16 ký tự, bao gồm chữ hoa, chữ thường, số, ký tự đặc biệt và không chứa khoảng trắng',
    confirmPasswordRequired: 'Xác nhận mật khẩu là bắt buộc. Vui lòng nhập lại mật khẩu',
    confirmPasswordMismatch: 'Mật khẩu nhập lại phải khớp với mật khẩu mới',
  },
  errors: {
    unauthorized: 'Truy cập không được phép. Vui lòng đăng nhập lại.',
    tokenExpired: 'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.',
    networkError: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.',
    serverError: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    unknownError: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.',
  },
}

