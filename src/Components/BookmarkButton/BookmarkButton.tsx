import { Bookmark } from "lucide-react";
import useBookmarkPost from "../../Hooks/useBookmarkPost";
import type { IPost } from "../../interfaces/posts.interface";

// the save icon of a post
export default function BookmarkButton({ post }: { post: IPost }) {
  const { mutate: bookmarkPost, isPending } = useBookmarkPost(post._id);

  const isSaved = post.bookmarked === true;

  let buttonClass = "text-gray-500 hover:text-blue-600 disabled:opacity-60";
  let iconClass = "";
  let label = "Save post";
  if (isSaved) {
    buttonClass = "text-blue-600 disabled:opacity-60";
    iconClass = "fill-current";
    label = "Remove from saved";
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={function () {
        bookmarkPost();
      }}
      disabled={isPending}
      className={buttonClass}
    >
      <Bookmark size={18} className={iconClass} />
    </button>
  );
}