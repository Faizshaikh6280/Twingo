import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import { POSTS } from '../../utils/db/dummy';
import useGetPosts from '../../hooks/useGetPosts';

const getPostsEndPoint = function (feedType) {
  switch (feedType) {
    case 'forYou':
      return '/api/post/all';
    case 'following':
      return '/api/post/following';
    default:
      return '/api/post/all';
  }
};

const Posts = ({ feedType }) => {
  const POST_END_POINT = getPostsEndPoint(feedType);
  const { loadingPosts, posts } = useGetPosts(POST_END_POINT, feedType);

  console.log(posts);

  return (
    <>
      {loadingPosts && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!loadingPosts && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!loadingPosts && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
