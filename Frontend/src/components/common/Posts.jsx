import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import useGetPosts from '../../hooks/useGetPosts';
import { useEffect } from 'react';

const getPostsEndPoint = function (feedType, userId, username) {
  switch (feedType) {
    case 'forYou':
      return '/api/post/all';
    case 'following':
      return '/api/post/following';
    case 'posts':
      return `/api/post/user/${username}`;
    case 'likes':
      return `/api/post/liked/${userId}`;
    default:
      return '/api/post/all';
  }
};

const Posts = ({ feedType, userId, username, setPost = () => {} }) => {
  const POST_END_POINT = getPostsEndPoint(feedType, userId, username);
  const { loadingPosts, data, isRefetching } = useGetPosts(POST_END_POINT, feedType);

  useEffect(() => {
    setPost((prev) => data?.posts || prev);
  }, [data, setPost]);

  return (
    <>
      {(loadingPosts || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!loadingPosts && !isRefetching && data?.posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!loadingPosts && !isRefetching && data?.posts && (
        <div>
          {data?.posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
