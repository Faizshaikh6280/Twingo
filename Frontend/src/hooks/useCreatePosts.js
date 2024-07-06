import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function useCreatePost() {
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending: creatingPost,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch('/api/post/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, image: img }),
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

  return { createPost, creatingPost, isError, error };
}

export default useCreatePost;
