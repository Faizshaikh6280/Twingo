import { useMutation } from '@tanstack/react-query';

function useFollowUnfollowUser() {
  const {
    mutate: followUnfollowUser,
    isPending: isWorking,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ id }) => {
      try {
        const res = await fetch(`/api/user/follow/${id}`, {
          method: 'POST',
        });
        const data = await res.json();

        if (!res.ok) {
          throw data;
        }
        return data;
      } catch (error) {
        throw new Error(error.message || 'Something went wrong.');
      }
    },
  });

  return { followUnfollowUser, isWorking, isError, error };
}

export default useFollowUnfollowUser;
