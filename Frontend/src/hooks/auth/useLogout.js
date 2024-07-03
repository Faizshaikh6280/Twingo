import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

function useLogout() {
  const queryClient = useQueryClient();
  const {
    mutate: logout,
    isPending: isLogingOut,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch('/api/auth/logout');
        const data = await res.json();
        if (!res.ok) {
          throw data;
        }
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Logout Succesfully!');
      queryClient.invalidateQueries({ queryKey: ['authuser'] });
    },
    onError: () => {
      toast.error(error.message);
    },
  });
  return { isLogingOut, logout, isError, error };
}

export default useLogout;
