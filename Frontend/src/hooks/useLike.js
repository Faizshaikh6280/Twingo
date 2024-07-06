import { useMutation, useQueryClient } from '@tanstack/react-query';

function useLike() {
  const queryClient = useQueryClient();
  const {
    mutate: like,
    isPending: isLiking,
    isError,
    error,
  } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(`/api/post/like/${id}`, {
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
    onSuccess: (data) => {
      // better way as we are just updated the post that has been changed.
      queryClient.setQueryData(['posts'], (old) => {
        const newPosts = old.posts.map((oldpost) => {
          const isTrue = oldpost._id.toString() === data.post._id.toString();
          const post = isTrue ? { ...oldpost, likes: data.post.likes } : { ...oldpost };
          return post;
        });
        return { ...old, posts: newPosts };
      });
    },
  });

  return { like, isLiking, isError, error };
}

export default useLike;
