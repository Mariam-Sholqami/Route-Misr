import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { authContext } from "../../Context/AuthContext";
import useUserProfile from "../../Hooks/useUserProfile";
import useUserPosts from "../../Hooks/useUserPosts";
import FollowButton from "../../Components/FollowButton/FollowButton";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import PostCard from "../../Components/PostCard/PostCard";
import Loader from "../../Components/Loader/Loader";

// the profile of ANOTHER user 
export default function UserProfile() {
  const { userId } = useParams();
  const { userData } = useContext(authContext);

  const { data: profile, isLoading, isError } = useUserProfile(userId);
  // userPosts = { posts, total }
  const { data: userPosts, isLoading: postsLoading, isError: postsError } = useUserPosts(userId);

  // if my own id=> go to my profile page
  if (userData !== null && userData._id === userId) {
    return <Navigate to="/profile" replace />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError || profile === undefined) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12 text-center">
        <p className="text-gray-600">Could not load this profile</p>
      </main>
    );
  }

  const user = profile.user;

  function renderPosts() {
    if (postsLoading) {
      return <Loader />;
    }

    if (postsError || userPosts === undefined) {
      return <p className="text-center text-sm text-red-500">Could not load the posts</p>;
    }

    if (userPosts.posts.length === 0) {
      return <p className="text-center text-sm text-gray-500">No posts yet</p>;
    }

    return (
      <>
        {userPosts.posts.map(function (post) {
          return <PostCard key={post._id} post={post} hideOwnerActions />;
        })}

        {/* the API sends only the latest 40 posts (no pages)*/}
        {userPosts.total > userPosts.posts.length && (
          <p className="text-center text-sm text-gray-500">
            Showing the latest {userPosts.posts.length} of {userPosts.total} posts
          </p>
        )}
      </>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <ProfileHeader
          user={user}
          followers={user.followers}
          following={user.following}
          action={<FollowButton userId={user._id} size="lg" />}
        />

        <h2 className="px-1 text-lg font-semibold">Posts</h2>
        {renderPosts()}
      </div>
    </main>
  );
}