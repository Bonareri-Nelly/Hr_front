export const useRBAC = () => {
  return {
    hasPermission: (permission: string) => {
      // Mock permission check - always returns true for development
      console.log('Checking permission:', permission);
      return true;
    },
    getUserPermissions: () => {
      return {
        financeBranchIds: [],
        roles: ['finance']
      };
    }
  };
};