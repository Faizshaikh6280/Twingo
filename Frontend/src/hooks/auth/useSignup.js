import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

function useSignup() {
  const queryClient = useQueryClient();
  const {
    mutate: signUp,
    isPending: isSigningup,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ email, username, fullname, password }) => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, fullname, password }),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw data;
      }
    },
    onSuccess: () => {
      toast.success('Account created Succesfully!');
      queryClient.invalidateQueries({ queryKey: ['authuser'] });
      queryClient.invalidateQueries({ queryKey: ['suggestedUser'] });
    },
  });
  return { isSigningup, signUp, isError, error };
}

export default useSignup;
