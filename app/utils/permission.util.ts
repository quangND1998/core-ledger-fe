import { useProfileStore } from '~/stores/profile'

/**
 * Check if user has a specific permission
 * @param permissionName - The permission name to check (e.g., 'coa.view', 'journals.view')
 * @returns boolean - true if user has the permission, false otherwise
 */
export const hasPermission = (permissionName: string): boolean => {
  const profileStore = useProfileStore()
  const profile = profileStore.profile

  if (!profile || !profile.permissions) {
    return false
  }

  return profile.permissions.some(permission => permission.name === permissionName)
}

/**
 * Check if user has any of the specified permissions
 * @param permissionNames - Array of permission names to check
 * @returns boolean - true if user has at least one of the permissions, false otherwise
 */
export const hasAnyPermission = (permissionNames: string[]): boolean => {
  return permissionNames.some(permissionName => hasPermission(permissionName))
}

/**
 * Check if user has all of the specified permissions
 * @param permissionNames - Array of permission names to check
 * @returns boolean - true if user has all of the permissions, false otherwise
 */
export const hasAllPermissions = (permissionNames: string[]): boolean => {
  return permissionNames.every(permissionName => hasPermission(permissionName))
}

/**
 * Check if user has a specific role
 * @param roleName - The role name to check (e.g., 'viewer', 'admin')
 * @returns boolean - true if user has the role, false otherwise
 */
export const hasRole = (roleName: string): boolean => {
  const profileStore = useProfileStore()
  const profile = profileStore.profile

  if (!profile || !profile.roles) {
    return false
  }

  return profile.roles.some(role => role.name === roleName)
}

/**
 * Check if user has any of the specified roles
 * @param roleNames - Array of role names to check
 * @returns boolean - true if user has at least one of the roles, false otherwise
 */
export const hasAnyRole = (roleNames: string[]): boolean => {
  return roleNames.some(roleName => hasRole(roleName))
}

/**
 * Check if user has all of the specified roles
 * @param roleNames - Array of role names to check
 * @returns boolean - true if user has all of the roles, false otherwise
 */
export const hasAllRoles = (roleNames: string[]): boolean => {
  return roleNames.every(roleName => hasRole(roleName))
}

/**
 * Get all user permissions
 * @returns string[] - Array of permission names
 */
export const getUserPermissions = (): string[] => {
  const profileStore = useProfileStore()
  const profile = profileStore.profile

  if (!profile || !profile.permissions) {
    return []
  }

  return profile.permissions.map(permission => permission.name)
}

/**
 * Get all user roles
 * @returns string[] - Array of role names
 */
export const getUserRoles = (): string[] => {
  const profileStore = useProfileStore()
  const profile = profileStore.profile

  if (!profile || !profile.roles) {
    return []
  }

  return profile.roles.map(role => role.name)
}

