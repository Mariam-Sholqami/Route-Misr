import { useContext, useState } from "react";
import { Avatar } from "@heroui/react";
import { Loader2, Pencil, ThumbsUp, Trash2 } from "lucide-react";
import { authContext } from "../../Context/AuthContext";
import useDeleteComment from "../../Hooks/UseDeleteComment";
import useLikeComment from "../../Hooks/useLikeComment";
import CommentEditor from "../CommentEditor/CommentEditor";
import Replies from "../Replies/Replies";
import UserLink from "../UserLink/UserLink";
import CreateReply from "../CreateReply/CreateReply";
import confirmDelete from "../../utils/confirmDelete";
import type { IComment } from "../../interfaces/posts.interface";


export default function CommentCard({
  comment,
  allowReplies = false,
}: {
  comment: IComment;
  allowReplies?: boolean;
}) {
  const { userData } = useContext(authContext);

  const [isEditing, setIsEditing] = useState(false);

  const [showReplies, setShowReplies] = useState(false);

  const [showReplyBox, setShowReplyBox] = useState(false);

  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(
    comment.post,
    comment._id
  );

  const { mutate: likeComment, isPending: isLiking } = useLikeComment(
    comment.post,
    comment._id
  );

  // did I like this comment
  const isLiked = userData !== null && comment.likes.includes(userData._id);

  // the like button turns blue when I liked the comment
  let likeButtonClass = "flex items-center gap-1 hover:text-blue-600 disabled:opacity-60";
  let likeIconClass = "";
  if (isLiked) {
    likeButtonClass = likeButtonClass + " text-blue-600";
    likeIconClass = "fill-current";
  }

  // the edit and delete buttons are only for the owner of the comment
  const isMine = userData?._id === comment.commentCreator._id;

  const date = new Date(comment.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const repliesCount = comment.repliesCount ?? 0;
  let viewRepliesText = "View " + repliesCount + " replies";
  if (showReplies) {
    viewRepliesText = "Hide replies";
  } else if (repliesCount === 1) {
    viewRepliesText = "View 1 reply";
  }

  async function handleDelete() {
    if (await confirmDelete("Delete this comment?")) {
      deleteComment();
    }
  }

  let deleteIcon = <Trash2 size={14} />;
  if (isDeleting) {
    deleteIcon = <Loader2 size={14} className="animate-spin" />;
  }

  return (
    <div className="flex items-start gap-3">
      {/*go to the comment creator's profile*/}
      <UserLink userId={comment.commentCreator._id} className="shrink-0">
        <Avatar size="sm">
          <Avatar.Image src={comment.commentCreator.photo} alt="Profile photo" />
          <Avatar.Fallback>
            {comment.commentCreator.name.slice(0, 2).toUpperCase()}
          </Avatar.Fallback>
        </Avatar>
      </UserLink>

      <div className="min-w-0 flex-1">
        <p className="mb-1 px-2 text-sm font-semibold">
          <UserLink userId={comment.commentCreator._id} className="hover:underline">
            {comment.commentCreator.name}
          </UserLink>
        </p>

        {/* edit mode */}
        {isEditing && (
          <CommentEditor
            comment={comment}
            onDone={function () {
              setIsEditing(false);
            }}
          />
        )}

        {/* only the text if the comment has one */}
        {!isEditing && comment.content && (
          <div className="w-fit max-w-full rounded-2xl bg-gray-100 px-4 py-2">
            <p className="whitespace-pre-wrap break-words text-sm">{comment.content}</p>
          </div>
        )}

        {/* image only if the comment has one*/}
        {!isEditing && comment.image && (
          <img
            src={comment.image}
            alt="Comment"
            className="mt-2 max-h-64 rounded-xl object-cover"
          />
        )}

        {/* icons for the owner */}
        <div className="mt-1 flex items-center gap-3 px-2 text-xs text-gray-500">
          <span>{date}</span>

          {/* like / unlike with the number of likes if there are */}
          <button
            type="button"
            aria-label="Like comment"
            onClick={function () {
              likeComment();
            }}
            disabled={isLiking}
            className={likeButtonClass}
          >
            <ThumbsUp size={14} className={likeIconClass} />
            {comment.likes.length > 0 && <span>{comment.likes.length}</span>}
          </button>

          {/* button open Reply box */}
          {allowReplies && (
            <button
              type="button"
              onClick={function () {
                setShowReplyBox(!showReplyBox);
              }}
              className="font-medium hover:text-blue-600"
            >
              Reply
            </button>
          )}

          {isMine && !isEditing && (
            <>
              <button
                type="button"
                aria-label="Edit comment"
                onClick={function () {
                  setIsEditing(true);
                }}
                className="hover:text-blue-600"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                aria-label="Delete comment"
                onClick={handleDelete}
                disabled={isDeleting}
                className="hover:text-red-600 disabled:opacity-60"
              >
                {deleteIcon}
              </button>
            </>
          )}
        </div>

        {/* View replies*/}
        {allowReplies && (repliesCount > 0 || showReplies) && (
          <div className="mt-1 px-2 text-xs text-gray-500">
            <button
              type="button"
              onClick={function () {
                setShowReplies(!showReplies);
              }}
              className="font-medium hover:text-blue-600"
            >
              {viewRepliesText}
            </button>
          </div>
        )}

        {/* the replies list and the box to write a reply */}
        {allowReplies && (showReplies || showReplyBox) && (
          <div className="mt-3 space-y-3 border-l-2 border-gray-100 pl-3">
            {showReplies && <Replies comment={comment} />}
            {showReplyBox && (
              <CreateReply
                postId={comment.post}
                commentId={comment._id}
                onCreated={function () {
                  // after adding a reply show the list 
                  setShowReplies(true);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}