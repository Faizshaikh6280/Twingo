import { useQuery } from '@tanstack/react-query';

function useGetUserProfile(username) {
  const {
    data,
    isLoading: loadingUserProfile,
    isError,
    error,
  } = useQuery({
    queryKey: [username],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/user/profile/${username}`);
        const data = await res.json();
        if (data.status === 'success') {
          return data;
        }
        throw data;
      } catch (error) {
        throw error;
      }
    },
  });

  return { data, loadingUserProfile, isError, error };
}

export default useGetUserProfile;
