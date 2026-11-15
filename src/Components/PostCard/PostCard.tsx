import { useContext, useState } from "react";
import type { ReactNode } from "react";
import { Avatar } from "@heroui/react";
import { Link } from "react-router-dom";
import { ArrowUpRight, EyeOff, MessageCircle, ThumbsUp, User } from "lucide-react";
import { authContext } from "../../Context/AuthContext";
import useLikePost from "../../Hooks/useLikePost";
import FollowButton from "../FollowButton/FollowButton";
import UserLink from "../UserLink/UserLink";
import BookmarkButton from "../BookmarkButton/BookmarkButton";
import CommentCard from "../CommentCard/CommentCard";
import CreateComment from "../Createcomment/Createcomment";
import LikesModal from "../LikesModal/LikesModal";
import PostActions from "../PostActions/PostActions";
import PostEditor from "../PostEditor/PostEditor";
import SharePost from "../SharePost/SharePost";
import type { IPost } from "../../interfaces/posts.interface";

// same classes for the 3 action buttons
const actionButtonClass =
  "flex items-center justify-center gap-2 py-3 transition hover:bg-gray-100";

/******* parts same for post and shared post=> header + text + image *******/
function PostContent({
  post,
  link,
  actions,
  editor,
  followButton,
}: {
  post: IPost;
  link?: string;
  actions?: ReactNode;
  editor?: ReactNode;
  followButton?: ReactNode;
}) {
  const date = new Date(post.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  //  post text in short form or in full
  const [isExpanded, setIsExpanded] = useState(false);

  // divide the post text into words
  const words = post.body?.trim().split(/\s+/) || [];

  const isLong = words.length > 30;

  const displayedBody =
    isExpanded || !isLong
      ? post.body
      : words.slice(0, 30).join(" ") + "...";

  // date=> link to postDetails page
  let dateElement = <span>{date}</span>;
  if (link) {
    dateElement = (
      <Link to={link} className="hover:underline">
        {date}
      </Link>
    );
  }

  // image: same
  const imageTag = (
    <img src={post.image} alt="Post" className="max-h-[32rem] w-full object-cover" />
  );
  let imageElement = imageTag;
  if (link) {
    imageElement = (
      <Link to={link} className="block">
        {imageTag}
      </Link>
    );
  }

  return (
    <div className="space-y-4 py-5">
      {/* header*/}
      <header className="flex items-center gap-3 px-5">
        {/* avatar , name , the username open the profile of the owner of the post  */}
        <UserLink userId={post.user._id} className="shrink-0">
          <Avatar size="md">
            <Avatar.Image src={post.user.photo} alt="Profile photo" />
            <Avatar.Fallback>{post.user.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
          </Avatar>
        </UserLink>

        <div className="min-w-0 flex-1">
          <UserLink userId={post.user._id} className="block truncate font-semibold hover:underline">
            {post.user.name}
          </UserLink>
          <p className="truncate text-sm text-gray-500">
            <UserLink userId={post.user._id} className="hover:underline">
              @{post.user.username}
            </UserLink>{" "}
            · {dateElement}
          </p>
        </div>

        {followButton}
        {actions}
      </header>

            {editor ? (
        editor
      ) : (
        <>
          {post.body && (
            <div className="px-5">
              <p className="whitespace-pre-wrap">{displayedBody}</p>

              {isLong && (
                <button
                  type="button"
                  onClick={function () {
                    setIsExpanded(!isExpanded);
                  }}
                  className="mt-1 text-sm font-semibold text-blue-600 hover:underline"
                >
                  {isExpanded ? "See less" : "See more"}
                </button>
              )}
            </div>
          )}

          {post.image && imageElement}
        </>
      )}
    </div>
  );
}

// isDetails = true when the card is shown inside the single post page
// hideOwnerActions = true inside the profile page of the owner
export default function PostCard({
  post,
  isDetails = false,
  hideOwnerActions = false,
}: {
  post: IPost;
  isDetails?: boolean;
  hideOwnerActions?: boolean;
}) {
  const { userData } = useContext(authContext);
  const { mutate: likePost, isPending: isLiking } = useLikePost(post._id);

  const topComment = post.topComment;
  const postLink = `/posts/${post._id}`;
  const commentsLink = `/posts/${post._id}#comments`; // opens the post page and jumps to the comments


  const sharedOriginal = post.sharedPost;
  const hasSharedContent = !!sharedOriginal && !!sharedOriginal.user && !sharedOriginal.unavailable;

  // We can't detect if the original shared post was deleted when the current post has a body
  // because the API returns sharedPost: null and isShare: false
  // So this condition only works when the shared post has no body or image.
  const isSharedUnavailable = !hasSharedContent && (post.isShare || (!post.body && !post.image));

  // if I like this post=>my id is in the list of the people who liked it
  const isLiked = userData !== null && post.likes.includes(userData._id);

 
  let likeButtonClass = actionButtonClass;
  let likeIconClass = "";
  if (isLiked) {
    likeButtonClass = actionButtonClass + " text-blue-600";
    likeIconClass = "fill-current";
  }

  // no "View profile" / "Follow" buttons on my own posts or when the page already is his profile
  const isMyPost = userData !== null && userData._id === post.user._id;

  let profileActions: ReactNode;
  if (!isMyPost && !hideOwnerActions) {
    profileActions = (
      <div className="flex shrink-0 items-center gap-1">
        <Link
          to={`/users/${post.user._id}`}
          title="View profile"
          aria-label={`View the profile of ${post.user.name}`}
          className="flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
        >
          <User size={16} />
          <span className="hidden sm:inline">View profile</span>
        </Link>

        <FollowButton userId={post.user._id} />
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);

  //date and the image open the post page=> Inside postDetails page they are not links
  let contentLink: string | undefined;
  if (!isDetails) {
    contentLink = postLink;
  }

  let editor: ReactNode;
  if (isEditing) {
    editor = (
      <PostEditor
        post={post}
        onDone={function () {
          setIsEditing(false);
        }}
      />
    );
  }

  // comment button=> came date and the image
  let commentButton = (
    <button type="button" className={actionButtonClass}>
      <MessageCircle size={18} />
      Comment
    </button>
  );
  if (!isDetails) {
    commentButton = (
      <Link to={commentsLink} className={actionButtonClass}>
        <MessageCircle size={18} />
        Comment
      </Link>
    );
  }

  // N Comments=> opens the post page and jumps to the comments
  let commentsCount = <span>{post.commentsCount} Comments</span>;
  if (!isDetails) {
    commentsCount = (
      <Link to={commentsLink} className="hover:underline">
        {post.commentsCount} Comments
      </Link>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md">
      <PostContent
        post={post}
        link={contentLink}
        followButton={profileActions}
        actions={
          <div className="flex items-center gap-3">
            <BookmarkButton post={post} />
            <PostActions
              post={post}
              isDetails={isDetails}
              onEdit={function () {
                setIsEditing(true);
              }}
            />
          </div>
        }
        editor={editor}
      />

      {/*  share=> show the original post inside a box */}
      {hasSharedContent && sharedOriginal && (
        <div className="mx-5 mb-5 overflow-hidden rounded-xl border border-gray-200">
          <PostContent post={sharedOriginal} />
        </div>
      )}

      {/* the original post of this share is deleted */}
      {isSharedUnavailable && (
        <div className="mx-5 mb-5 flex flex-col items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center">
          <EyeOff size={20} className="text-gray-400" />
          <p className="font-medium text-gray-700">This content isn't available</p>
          <p className="text-sm text-gray-500">The original post was deleted or is no longer available</p>
        </div>
      )}

      {/* counts */}
      <div className="flex gap-5 border-t border-gray-100 px-5 py-3 text-sm text-gray-500">
        <LikesModal postId={post._id} likesCount={post.likesCount} />
        {commentsCount}
        <span>{post.sharesCount} Shares</span>

        {/*View post*/}
        {!isDetails && (
          <Link
            to={postLink}
            className="ml-auto flex items-center gap-1 font-medium text-blue-600 hover:underline"
          >
            View post
            <ArrowUpRight size={14} />
          </Link>
        )}
      </div>

      {/* action buttons: like, comment, share */}
      <div className="grid grid-cols-3 border-t border-gray-100 text-sm font-medium text-gray-600">
        <button
          type="button"
          onClick={function () {
            likePost();
          }}
          disabled={isLiking}
          className={likeButtonClass + " disabled:opacity-60"}
        >
          <ThumbsUp size={18} className={likeIconClass} />
          Like
        </button>
        {commentButton}
        <SharePost post={post} className={actionButtonClass} />
      </div>

      {/* first comment=> only in the feed  */}
      {!isDetails && topComment && (
        <div className="border-t border-gray-100 px-5 py-4">
          <CommentCard comment={topComment} />
        </div>
      )}

      {/* write comment*/}
      <div className="border-t border-gray-100 px-5 py-4">
        <CreateComment postId={post._id} />
      </div>
    </article>
  );
}