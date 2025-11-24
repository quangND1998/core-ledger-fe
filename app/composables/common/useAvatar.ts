/**
 * Composable để xử lý avatar (background color, text color, initials)
 * Có thể tái sử dụng ở nhiều component
 */
export const useAvatar = () => {
  /**
   * Lấy avatar background color dựa trên index
   * @param index - Index để chọn màu (có thể là index của item trong list hoặc hash)
   * @returns Tailwind CSS class cho background color
   */
  const getAvatarBg = (index: number): string => {
    const colors = [
      'bg-[#fff1df]',
      'bg-[#f7e1e1]',
      'bg-[#daedff]',
      'bg-[#e4f6d2]',
      'bg-[#0000001a]',
    ];
    const colorIndex = Math.abs(index) % colors.length;
    return colors[colorIndex] || 'bg-[#0000001a]';
  };

  /**
   * Lấy avatar text color dựa trên background color
   * @param bg - Background color class (ví dụ: 'bg-[#fff1df]')
   * @returns Tailwind CSS class cho text color
   */
  const getAvatarColor = (bg: string): string => {
    if (bg.includes('fff1df')) return 'text-[#d2510e]';
    if (bg.includes('f7e1e1')) return 'text-[#ee443f]';
    if (bg.includes('daedff')) return 'text-[#192e53]';
    if (bg.includes('e4f6d2')) return 'text-[#07564d]';
    return 'text-[#000000b2]';
  };

  /**
   * Lấy initials từ tên đầy đủ
   * @param name - Tên đầy đủ (ví dụ: "Nguyen Van A" hoặc "John Doe")
   * @returns Initials (ví dụ: "NA" hoặc "JD")
   */
  const getInitials = (name: string | undefined | null): string => {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(part => part.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  /**
   * Lấy avatar background color từ string (hash-based)
   * Hữu ích khi muốn có màu ổn định cho cùng một tên/email
   * @param str - String để hash (ví dụ: email, name, id)
   * @returns Tailwind CSS class cho background color
   */
  const getAvatarBgFromString = (str: string): string => {
    if (!str) return 'bg-[#0000001a]';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return getAvatarBg(Math.abs(hash));
  };

  return {
    getAvatarBg,
    getAvatarColor,
    getInitials,
    getAvatarBgFromString,
  };
};


