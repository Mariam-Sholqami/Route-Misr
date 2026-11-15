import { Avatar } from "@heroui/react";
import UserLink from "../UserLink/UserLink";
import useFollowSuggestions from "../../Hooks/useFollowSuggestions";
import FollowButton from "../FollowButton/FollowButton";

// mutual followers if there are any otherwise his followers
function getInfoText(mutual: number, followers: number) {
  if (mutual > 0) {
    if (mutual === 1) {
      return "1 mutual follower";
    }
    return `${mutual} mutual followers`;
  }

  if (followers === 1) {
    return "1 follower";
  }
  return `${followers} followers`;
}

export default function PeopleYouMayKnow() {
  const { data: suggestions } = useFollowSuggestions(10);

  if (suggestions === undefined || suggestions.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3 rounded-2xl bg-white p-4 shadow-md">
      <h2 className="font-semibold">People you may know</h2>

      <ul className="flex snap-x gap-3 overflow-x-auto pb-2">
        {suggestions.map(function (person) {
          return (
            <li
              key={person._id}
              className="relative flex w-40 shrink-0 snap-start flex-col items-center gap-2 rounded-xl border border-gray-200 p-3 text-center transition hover:bg-gray-50"
            >
              {/*click anywhere on it opens the profile => the Follow button is above this layer */}
              <UserLink
                userId={person._id}
                className="flex w-full min-w-0 flex-col items-center gap-2 after:absolute after:inset-0 after:rounded-xl"
              >
                <Avatar className="size-20 text-2xl">
                  <Avatar.Image src={person.photo} alt="Profile photo" />
                  <Avatar.Fallback>{person.name.trim().slice(0, 2).toUpperCase()}</Avatar.Fallback>
                </Avatar>

                <div className="w-full min-w-0">
                  <p className="truncate text-sm font-semibold hover:underline">
                    {person.name.trim()}
                  </p>
                  <p className="truncate text-xs text-gray-500">@{person.username}</p>
                </div>
              </UserLink>

              <p className="text-xs text-gray-500">
                {getInfoText(person.mutualFollowersCount, person.followersCount)}
              </p>

              <div className="relative z-10 w-full">
                <FollowButton userId={person._id} size="block" />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}