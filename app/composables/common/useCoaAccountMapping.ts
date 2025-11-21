import { STATUS_ACCOUNT, TYPES_ACCOUNT } from '~/common/constants';

type StatusType = typeof STATUS_ACCOUNT[number]['status'];
type TypeType = typeof TYPES_ACCOUNT[number]['type'];

interface StatusStyles {
  statusBg: string;
  statusColor: string;
  statusHover: string;
}

interface TypeStyles {
  typeBg: string;
  typeColor: string;
  typeHover: string;
}

/**
 * Composable để mapping status và type của COA Account
 */
export const useCoaAccountMapping = () => {
  /**
   * Lấy styles cho status
   * @param status - Status cần mapping (Active, Lock, Inactive)
   * @returns Object chứa statusBg, statusColor, statusHover hoặc null nếu không tìm thấy
   */
  const getStatusStyles = (status: string): StatusStyles | null => {
    const statusConfig = STATUS_ACCOUNT.find(
      (item) => item.status.toLowerCase() === status.toLowerCase()
    );
    
    if (!statusConfig) {
      return null;
    }

    return {
      statusBg: statusConfig.statusBg,
      statusColor: statusConfig.statusColor,
      statusHover: statusConfig.statusHover,
    };
  };

  /**
   * Lấy styles cho type
   * @param type - Type cần mapping (Asset, Equity, Exp, Liab, Rev)
   * @returns Object chứa typeBg, typeColor, typeHover hoặc null nếu không tìm thấy
   */
  const getTypeStyles = (type: string): TypeStyles | null => {
    const typeConfig = TYPES_ACCOUNT.find(
      (item) => item.type.toLowerCase() === type.toLowerCase()
    );
    
    if (!typeConfig) {
      return null;
    }

    return {
      typeBg: typeConfig.typeBg,
      typeColor: typeConfig.typeColor,
      typeHover: typeConfig.typeHover,
    };
  };

  /**
   * Lấy tất cả status configurations
   */
  const getAllStatusConfigs = () => STATUS_ACCOUNT;

  /**
   * Lấy tất cả type configurations
   */
  const getAllTypeConfigs = () => TYPES_ACCOUNT;

  return {
    getStatusStyles,
    getTypeStyles,
    getAllStatusConfigs,
    getAllTypeConfigs,
  };
};

