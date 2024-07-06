import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function useGetNotification() {
  const {
    data,
    isLoading: loadingNotifications,
    isRefetching,
    isError,
    error,
  } = useQuery({
    queryKey: [`notifications`],
    queryFn: async () => {
      try {
        const res = await fetch('/api/notification');
        const data = await res.json();
        if (data.status === 'success') {
          return data;
        }
        throw data;
      } catch (error) {
        toast.error(error.message || 'Something went wrong');
      }
    },
  });

  return { data, isRefetching, loadingNotifications, isError, error };
}

export default useGetNotification;
