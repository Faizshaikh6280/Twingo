import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

function useGetPosts(postEndPoint, feedType, username) {
  const {
    data,
    isLoading: loadingPosts,
    isError,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await fetch(postEndPoint);
        const data = await res.json();
        if (data.status === 'success') {
          return data;
        }
        throw data;
      } catch (error) {
        toast.error(error.message || 'Something went wrong.');
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return { data, isRefetching, loadingPosts, isError, error };
}

export default useGetPosts;
