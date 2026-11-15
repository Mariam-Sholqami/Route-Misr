import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import usePost from "../../Hooks/usePost";
import useComments from "../../Hooks/useComments";
import PostCard from "../../Components/PostCard/PostCard";
import CommentCard from "../../Components/CommentCard/CommentCard";
import Loader from "../../Components/Loader/Loader";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: post, isLoading, isError, error } = usePost(id);
  const {
    data: comments,
    isLoading: commentsLoading,
    isError: commentsError,
    hasNextPage: hasMoreComments,
    isFetchingNextPage: isFetchingMoreComments,
    fetchNextPage: fetchMoreComments,
  } = useComments(id);

  // when the page is opened with #comments in the link=> jump to the comments 
  const commentsRef = useRef<HTMLElement>(null);
  useEffect(
    function () {
      if (location.hash === "#comments" && post !== undefined) {
        commentsRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [location.hash, post]
  );

  // Back=> go back in the history=> keep feed in its scroll position).
  // If the page was opened directly => go to the feed.
  function goBack() {
    if (location.key === "default") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError || post === undefined) {
    // 404 = the post was deleted or the link is wrong
    let errorMessage = error?.message || "Could not load the post";
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      errorMessage = "This post is no longer available";
    }

    return (
      <div className="mx-auto my-8 max-w-xl space-y-4 px-4">
        <p className="rounded-2xl bg-red-50 px-6 py-3 text-red-600">{errorMessage}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to the feed
        </Link>
      </div>
    );
  }

  const totalComments = post.commentsCount;

  let viewMoreText = "View more comments";
  if (isFetchingMoreComments) {
    viewMoreText = "Loading...";
  }

  function renderComments() {
    if (commentsLoading) {
      return <p className="text-sm text-gray-500">Loading comments...</p>;
    }

    if (commentsError || comments === undefined) {
      return <p className="text-sm text-red-500">Could not load the comments</p>;
    }

    if (comments.length === 0) {
      return <p className="text-sm text-gray-500">No comments yet</p>;
    }

    return (
      <>
        {comments.map(function (comment) {
          return <CommentCard key={comment._id} comment={comment} allowReplies={true} />;
        })}

        {/*  this button asks for the next page */}
        {hasMoreComments && (
          <button
            type="button"
            onClick={function () {
              fetchMoreComments();
            }}
            disabled={isFetchingMoreComments}
            className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-60"
          >
            {viewMoreText}
          </button>
        )}
      </>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-xl space-y-6">
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <PostCard post={post} isDetails={true} />

        {/* all the comments */}
        <section ref={commentsRef} className="space-y-4 rounded-2xl bg-white p-5 shadow-md">
          <h2 className="font-semibold">Comments ({totalComments})</h2>
          {renderComments()}
        </section>
      </div>
    </main>
  );
}