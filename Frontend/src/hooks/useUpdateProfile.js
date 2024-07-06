import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function useUpdateProfile() {
  const {
    mutate: updateProfile,
    isPending: updatingProfile,
    isError,
    error,
  } = useMutation({
    mutationFn: async (formdata) => {
      try {
        const res = await fetch('/api/user/update-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdata),
        });

        const data = await res.json();
        if (!res.ok) {
          throw data;
        }
        return data;
      } catch (error) {
        toast.error(error.message || 'Something wentt wrong');
      }
    },
  });

  return { updateProfile, updatingProfile, isError, error };
}

export default useUpdateProfile;
