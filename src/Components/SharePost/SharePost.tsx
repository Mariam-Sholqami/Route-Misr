import { useRef, useState } from "react";
import { Share2 } from "lucide-react";
import useSharePost from "../../Hooks/useSharePost";
import type { IPost } from "../../interfaces/posts.interface";

// the Share button 
export default function SharePost({
  post,
  className,
}: {
  post: IPost;
  className: string;
}) {
  // true while the window is open
  const [open, setOpen] = useState(false);
  const shareBody = useRef<HTMLTextAreaElement>(null);

  const { mutate, isPending } = useSharePost(post._id);

  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function handleShare() {
    const body = shareBody.current?.value.trim() ?? "";

    mutate(body, { onSuccess: closeDialog });
  }

  return (
    <>
      <button type="button" onClick={openDialog} className={className}>
        <Share2 size={18} />
        Share
      </button>

      {/*dark layer over the whole screen when open */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onKeyDown={function (e) {
            // Esc closes it 
            if (e.key === "Escape") {
              closeDialog();
            }
          }}
          onClick={function (e) {
            // a click on the dark background closes it
            if (e.target === e.currentTarget) {
              closeDialog();
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 outline-none"
        >
          <div className="max-h-full w-full max-w-md space-y-4 overflow-y-auto rounded-2xl bg-white p-5">
            <h2 className="font-semibold">Share this post</h2>

            {/*text above the shared post */}
            <textarea
              ref={shareBody}
              rows={3}
              placeholder="Say something about this post..."
              autoFocus
              disabled={isPending}
              className="w-full resize-none rounded-2xl bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/*preview of the post we are sharing */}
            <div className="rounded-xl border border-gray-200 p-3 text-sm">
              <p className="font-semibold">{post.user.name}</p>
              {post.body && (
                <p className="mt-1 line-clamp-3 whitespace-pre-wrap">{post.body}</p>
              )}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="mt-2 max-h-32 rounded-lg object-cover"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 text-sm font-medium">
              <button
                type="button"
                onClick={closeDialog}
                disabled={isPending}
                className="rounded-full px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShare}
                disabled={isPending}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                <Share2 size={16} />
                {isPending ? "Sharing..." : "Share"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}