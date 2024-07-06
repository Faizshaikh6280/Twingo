import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function useDeleteNotification() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteNotifications,
    isPending: deletingNotifications,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/notification`, {
          method: 'DELETE',
        });

        const data = await res.json();

        if (!res.ok) {
          throw data;
        }
        return data;
      } catch (error) {
        toast.error(error.message || 'Something went wrong');
      }
    },
    onSuccess: () => {
      toast.success('Notifications deleted successfullly!');
      queryClient.invalidateQueries({ queryKey: [`notifications`] });
    },
  });

  return { deleteNotifications, deletingNotifications, isError, error };
}

export default useDeleteNotification;
