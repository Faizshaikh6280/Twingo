import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function useDeletePost() {
  const queryClient = useQueryClient();
  const {
    mutate: deletePost,
    isPending: deletingPost,
    isError,
    error,
  } = useMutation({
    mutationFn: async (postId) => {
      try {
        const res = await fetch(`/api/post/${postId}`, {
          method: 'DELETE',
        });

        const data = await res.json();

        if (!res.ok) {
          throw data;
        }
        return data;
      } catch (error) {
        toast.error(error.message || "Can't able to delete post");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return { deletePost, deletingPost, isError, error };
}

export default useDeletePost;
