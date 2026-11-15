import { useContext } from "react";
import { authContext } from "../../Context/AuthContext";
import useUserPosts from "../../Hooks/useUserPosts";
import useUserProfile from "../../Hooks/useUserProfile";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import CreatePost from "../../Components/CreatePost/CreatePost";
import PostCard from "../../Components/PostCard/PostCard";
import Loader from "../../Components/Loader/Loader";

export default function Profile() {
  // userData => used to know my id 
  const { userData, loadingUser } = useContext(authContext);

  // use userData only to get my id=> then fetch my profile using useUserProfile
  // profile-data endpoint returns followers and following as ids only
  // UserProfile endpoint returns their full data => we need it to display them in the profile
  const { data: myProfile, isError: profileError } = useUserProfile(userData?._id);

  // my posts (userPosts = { posts, total })
  const {
    data: userPosts,
    isLoading: postsLoading,
    isError: postsError,
  } = useUserPosts(userData?._id);

  if (loadingUser) {
    return <Loader />;
  }

  if (!userData || profileError) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12 text-center">
        <p className="text-gray-600">Could not load your profile</p>
      </main>
    );
  }

  if (myProfile === undefined) {
    return <Loader />;
  }

  const user = myProfile.user;

  function renderPosts() {
    if (postsLoading) {
      return <Loader />;
    }

    if (postsError || userPosts === undefined) {
      return <p className="text-center text-sm text-red-500">Could not load your posts</p>;
    }

    if (userPosts.posts.length === 0) {
      return <p className="text-center text-sm text-gray-500">You haven't posted anything yet</p>;
    }

    return (
      <>
        {userPosts.posts.map(function (post) {
          return <PostCard key={post.id} post={post} />;
        })}

        {/* the API sends only the latest 40 posts (no pages)*/}
        {userPosts.total > userPosts.posts.length && (
          <p className="text-center text-sm text-gray-500">
            Showing your latest {userPosts.posts.length} of {userPosts.total} posts
          </p>
        )}
      </>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* the top card*/}
        <ProfileHeader user={user} followers={user.followers} following={user.following} />

        {/* write a new post */}
        <CreatePost />

        {/* my posts */}
        <h2 className="px-1 text-lg font-semibold">My posts</h2>
        {renderPosts()}
      </div>
    </main>
  );
}