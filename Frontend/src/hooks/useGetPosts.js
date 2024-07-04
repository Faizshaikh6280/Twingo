import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function useGetPosts(postEndPoint, feedType) {
  const {
    data,
    isLoading: loadingPosts,
    isError,
    error,
  } = useQuery({
    queryKey: ['posts', `${feedType}`],
    queryFn: async () => {
      try {
        const res = await fetch(postEndPoint);
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

  return { data, loadingPosts, isError, error };
}

export default useGetPosts;
