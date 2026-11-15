import { useContext } from "react";
import { authContext } from "../../Context/AuthContext";
import useFollowUser from "../../Hooks/useFollowUser";

// the Follow / Unfollow button

export default function FollowButton({
  userId,
  size = "sm",
}: {
  userId: string;
  size?: "sm" | "lg" | "block";
}) {
  const { userData } = useContext(authContext);
  const { mutate: followUser, isPending } = useFollowUser(userId);

  // no follow button for myself
  if (userData === null || userData._id === userId) {
    return null;
  }

  const isFollowing = userData.following?.includes(userId) === true;

  let buttonClass = "rounded-full font-semibold transition disabled:opacity-60 ";
  if (size === "lg") {
    buttonClass += "px-6 py-2 text-sm ";
  } else if (size === "block") {
    buttonClass += "w-full px-4 py-1.5 text-sm ";
  } else {
    buttonClass += "px-3 py-1 text-sm ";
  }

  let text = "Follow";
  if (isFollowing) {
    text = "Unfollow";
    buttonClass += "bg-gray-100 text-gray-600 hover:bg-gray-200";
  } else if (size !== "sm") {
    buttonClass += "bg-blue-600 text-white hover:bg-blue-700";
  } else {
    buttonClass += "text-blue-600 hover:bg-blue-50";
  }

  return (
    <button
      type="button"
      onClick={function () {
        followUser();
      }}
      disabled={isPending}
      className={buttonClass}
    >
      {text}
    </button>
  );
}