import type { ReactNode } from "react";
import { Avatar } from "@heroui/react";
import { Cake, CalendarDays, Mail } from "lucide-react";
import FollowListModal from "../FollowListModal/FollowListModal";
import type { IProfileFollower } from "../../interfaces/profile.interface";

// header of profile page (my profile and the profile of another user use it)
export default function ProfileHeader({
  user,
  followers,
  following,
  action,
}: {
  user: {
    name: string;
    username: string;
    email: string;
    photo: string;
    cover: string;
    dateOfBirth: string;
    gender: string;
    createdAt: string;
    followersCount: number;
    followingCount: number;
  };
  followers?: IProfileFollower[];
  following?: IProfileFollower[];
  action?: ReactNode;
}) {
  const birthDate = new Date(user.dateOfBirth).toLocaleDateString("en-US", {
    dateStyle: "long",
  });
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    dateStyle: "long",
  });

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-md">
      {/* cover=> plain color if he has none */}
      <div className="h-40 bg-blue-600">
        {user.cover && <img src={user.cover} alt="Cover" className="h-full w-full object-cover" />}
      </div>

      <div className="px-6 pb-6">
        <div className="-mt-16 flex items-end justify-between">
          <Avatar className="size-32 border-4 border-white text-4xl">
            <Avatar.Image src={user.photo} alt="Profile photo" />
            <Avatar.Fallback>{user.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
          </Avatar>

          {action}
        </div>

        <h1 className="mt-3 text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-500">@{user.username}</p>

        {/* counts: followers and following => open list of names */}
        <div className="mt-4 flex gap-6 text-sm">
          <FollowListModal title="Followers" count={user.followersCount} users={followers} />
          <FollowListModal title="Following" count={user.followingCount} users={following} />
        </div>

        {/* info */}
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <Mail size={16} />
            {user.email}
          </li>
          <li className="flex items-center gap-2">
            <Cake size={16} />
            Born on {birthDate} · <span className="capitalize">{user.gender}</span>
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays size={16} />
            Joined {joinDate}
          </li>
        </ul>
      </div>
    </section>
  );
}