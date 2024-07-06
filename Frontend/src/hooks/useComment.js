import { useMutation, useQueryClient } from '@tanstack/react-query';

function useComment(id) {
  const queryClient = useQueryClient();

  const {
    mutate: comment,
    isPending: isCommenting,
    isError,
    error,
  } = useMutation({
    mutationFn: async (text) => {
      try {
        const res = await fetch(`/api/post/comment/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
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
      queryClient.setQueryData(['posts'], (old) => {
        const newPosts = old.posts.map((oldpost) => {
          const isTrue = oldpost._id.toString() === data.post._id.toString();
          const post = isTrue ? { ...oldpost, comments: data.post.comments } : { ...oldpost };
          return post;
        });
        return { ...old, posts: newPosts };
      });
    },
  });

  return { comment, isCommenting, isError, error };
}

export default useComment;
