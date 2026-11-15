import { useState } from "react";
import { Avatar } from "@heroui/react";
import { X } from "lucide-react";
import useLikes from "../../Hooks/useLikes";
import UserLink from "../UserLink/UserLink";

export default function LikesModal({
  postId,
  likesCount,
}: {
  postId: string;
  likesCount: number;
}) {
  //when window is open => requested 
  const [open, setOpen] = useState(false);
  const {
    data: likes,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLikes(postId, open);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  // "See more" button only if the API has more pages

  function renderViewMore() {
    if (!hasNextPage) {
      return null;
    }

    let viewMoreText = "See more";
    if (isFetchingNextPage) {
      viewMoreText = "Loading...";
    }

    return (
      <button
        type="button"
        onClick={function () {
          fetchNextPage();
        }}
        disabled={isFetchingNextPage}
        className="mt-3 text-sm font-medium text-blue-600 hover:underline disabled:opacity-60"
      >
        {viewMoreText}
      </button>
    );
  }

  function renderLikes() {
    if (isLoading) {
      return <p className="text-sm text-gray-500">Loading...</p>;
    }

    if (isError || likes === undefined) {
      return <p className="text-sm text-red-500">Could not load the likes</p>;
    }

    if (likes.length === 0) {
      return <p className="text-sm text-gray-500">No likes yet</p>;
    }

    return (
      <div className="max-h-80 overflow-y-auto">
        <ul className="space-y-3">
          {likes.map(function (user) {
            return (
              <li key={user._id} className="flex items-center gap-3">
                {/* the photo and the name open the profile of the user and close this window */}
                <UserLink userId={user._id} onClick={closeModal} className="shrink-0">
                  <Avatar size="sm">
                    <Avatar.Image src={user.photo} alt="Profile photo" />
                    <Avatar.Fallback>{user.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                  </Avatar>
                </UserLink>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    <UserLink
                      userId={user._id}
                      onClick={closeModal}
                      className="hover:underline"
                    >
                      {user.name}
                    </UserLink>
                  </p>
                  <p className="truncate text-xs text-gray-500">@{user.username}</p>
                </div>
              </li>
            );
          })}
        </ul>

        {renderViewMore()}
      </div>
    );
  }

  // no likes=> plain text nothing open
  if (likesCount === 0) {
    return <span>0 Likes</span>;
  }

  return (
    <>
      <button type="button" onClick={openModal} className="hover:underline">
        {likesCount} Likes
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
              <h2 className="font-semibold">Likes</h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {renderLikes()}
          </div>
        </div>
      )}
    </>
  );
}