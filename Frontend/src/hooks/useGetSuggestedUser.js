import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function useGetSuggestedUser() {
  const {
    data,
    isLoading: loadingUsers,
    isError,
    error,
  } = useQuery({
    queryKey: ['suggestedUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/user/suggested');
        const data = await res.json();
        if (data.status === 'success') {
          return data;
        }
        throw data;
      } catch (error) {
        toast.error(error.message || "Can't able to load posts");
      }
    },
  });

  return { data, loadingUsers, isError, error };
}

export default useGetSuggestedUser;
