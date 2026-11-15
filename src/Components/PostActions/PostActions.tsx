import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { authContext } from "../../Context/AuthContext";
import useDeletePost from "../../Hooks/UseDeletePost";
import confirmDelete from "../../utils/confirmDelete";
import type { IPost } from "../../interfaces/posts.interface";

//edit and delete icons of a post=> Only to the owner of the post 
export default function PostActions({
  post,
  isDetails,
  onEdit,
}: {
  post: IPost;
  isDetails: boolean;
  onEdit: () => void;
}) {
  const { userData } = useContext(authContext);
  const navigate = useNavigate();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost(post._id);

  // not my post=> no icons
  if (userData?._id !== post.user._id) {
    return null;
  }

  async function handleDelete() {
    if (await confirmDelete("Delete this post?")) {
      deletePost(undefined, {
        onSuccess: function () {
          // if we are inside postDetails=> it doesn't exist anymore=> go back to the feed
          if (isDetails) {
            navigate("/");
          }
        },
      });
    }
  }

  let deleteIcon = <Trash2 size={18} />;
  if (isDeleting) {
    deleteIcon = <Loader2 size={18} className="animate-spin" />;
  }

  return (
    <div className="flex items-center gap-3 text-gray-500">
      <button
        type="button"
        aria-label="Edit post"
        onClick={onEdit}
        className="hover:text-blue-600"
      >
        <Pencil size={18} />
      </button>
      <button
        type="button"
        aria-label="Delete post"
        onClick={handleDelete}
        disabled={isDeleting}
        className="hover:text-red-600 disabled:opacity-60"
      >
        {deleteIcon}
      </button>
    </div>
  );
}