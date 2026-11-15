import { useState } from "react";
import { Avatar } from "@heroui/react";
import UserLink from "../UserLink/UserLink";
import { X } from "lucide-react";
import type { IProfileFollower } from "../../interfaces/profile.interface";

// Followers/ Following list
// the list  inside the profile response
export default function FollowListModal({
  title,
  count,
  users,
}: {
  title: string;
  count: number;
  users: IProfileFollower[] | undefined;
}) {

  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  const label = (
    <>
      <span className="font-semibold">{count}</span>{" "}
      <span className="text-gray-500">{title}</span>
    </>
  );

  // nobody or the list is not loaded=> plain text nothing open
  if (count === 0 || users === undefined) {
    return <p>{label}</p>;
  }

  return (
    <>
      <button type="button" onClick={openModal} className="hover:underline">
        {label}
      </button>

      {/*  dark layer over the whole screen shown only while open */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          autoFocus
          onKeyDown={function (e) {
            // Esc closes it
            if (e.key === "Escape") {
              closeModal();
            }
          }}
          onClick={function (e) {
             //click on the dark background closes it
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 outline-none"
        >
          <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{title}</h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <ul className="max-h-80 space-y-3 overflow-y-auto">
              {users.map(function (user) {
                return (
                  <li key={user._id}>
                    {/* a click opens his profile and closes the window */}
                    <UserLink
                      userId={user._id}
                      onClick={closeModal}
                      className="flex items-center gap-3 rounded-lg p-1 hover:bg-gray-50"
                    >
                      <Avatar size="sm">
                        <Avatar.Image src={user.photo} alt="Profile photo" />
                        <Avatar.Fallback>{user.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                      </Avatar>
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                    </UserLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}