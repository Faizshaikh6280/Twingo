import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function useUpdateProfile(username) {
  const { data: authuser } = useQuery({ queryKey: ['authuser'] });
  const queyClient = useQueryClient();
  const {
    mutate: updateProfile,
    isPending: updatingProfile,
    isError,
    error,
  } = useMutation({
    mutationFn: async (formdata) => {
      try {
        const res = await fetch('/api/user/update-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdata),
        });

        const data = await res.json();
        if (!res.ok) {
          throw data;
        }
        return data;
      } catch (error) {
        toast.error(error.message || 'Something wentt wrong');
      }
    },
    onSuccess: () => {
      queyClient.invalidateQueries({ queryKey: [`${username}`] });

      if (username === authuser.username) {
        queyClient.invalidateQueries({ queryKey: [`authuser`] });
      }
    },
  });

  return { updateProfile, updatingProfile, isError, error };
}

export default useUpdateProfile;
