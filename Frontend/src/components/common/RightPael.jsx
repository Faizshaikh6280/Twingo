import { Link } from 'react-router-dom';
import RightPanelSkeleton from '../skeletons/RightPanelSkeleton';
import useGetSuggestedUser from '../../hooks/useGetSuggestedUser';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useFollowUnfollowUser from '../../hooks/useFollowUnfollowUser';
import toast from 'react-hot-toast';

const RightPanel = () => {
  const { data, loadingUsers } = useGetSuggestedUser();
  const { data: authuser } = useQuery({ queryKey: ['authuser'] });
  const { followUnfollowUser } = useFollowUnfollowUser();
  const queryClient = useQueryClient();

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4 ">
          {/* item */}
          {loadingUsers && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!loadingUsers && data?.length == 0 && (
            <p>You are following all the people on Twingo 😉</p>
          )}
          {!loadingUsers &&
            data?.suggestedUsers.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || '/avatar-placeholder.png'} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullname}
                    </span>
                    <span className="text-sm text-slate-500">@{user.username}</span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      followUnfollowUser(
                        { id: user._id },
                        {
                          onSuccess: () => {
                            const isFollow = authuser.following.includes(user._id);
                            toast.success(
                              `You ${isFollow ? 'Unfollowed' : 'follows'} ${user.fullname}.`
                            );
                            queryClient.invalidateQueries({ queryKey: ['authuser'] });
                            queryClient.invalidateQueries({ queryKey: ['suggestedUser'] });
                          },
                        }
                      );
                    }}
                  >
                    Follow
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
