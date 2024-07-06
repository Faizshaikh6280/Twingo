import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

function useLogin() {
  const queryClient = useQueryClient();
  const {
    mutate: login,
    isPending: isLoging,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success('Login Succesfully!');
      queryClient.invalidateQueries({ queryKey: ['authuser'] });
      queryClient.invalidateQueries({ queryKey: ['suggestedUser'] });
    },
  });
  return { isLoging, login, isError, error };
}

export default useLogin;
