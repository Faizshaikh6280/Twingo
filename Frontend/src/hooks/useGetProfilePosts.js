import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

function useGetProfilePosts(endPoint, feedType) {
  const {
    data,
    isLoading: loadingPosts,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ['profile-posts'],
    queryFn: async () => {
      try {
        const res = await fetch(endPoint);
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

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return { data, isRefetching, loadingPosts, isError, error };
}

export default useGetProfilePosts;
