import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/api/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(['currentUser'], null);
    },
  });

  const currentUser = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser().then((res) => res.data),
    enabled: !!localStorage.getItem('accessToken'),
    staleTime: 5 * 60 * 1000,
  });

  const register = useMutation({
    mutationFn: authApi.register,
  });

  const updateProfile = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['currentUser'] }),
  });

  const changePassword = useMutation({
    mutationFn: authApi.changePassword,
  });

  return {
    login: login.mutateAsync,
    logout: logout.mutateAsync,
    currentUser: currentUser.data,
    isLoading: currentUser.isLoading,
    register: register.mutateAsync,
    updateProfile: updateProfile.mutateAsync,
    changePassword: changePassword.mutateAsync,
  };
};