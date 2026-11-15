import useReplies from "../../Hooks/useReplies";
import CommentCard from "../CommentCard/CommentCard";
import type { IComment } from "../../interfaces/posts.interface";

// the list of the replies of a comment
export default function Replies({ comment }: { comment: IComment }) {
  const {
    data: replies,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useReplies(comment.post, comment._id);

  //View more replies=> if the API has more pages
  function renderViewMore() {
    if (!hasNextPage) {
      return null;
    }

    let viewMoreText = "View more replies";
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
        className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-60"
      >
        {viewMoreText}
      </button>
    );
  }

  //cases 
  function renderReplies() {
    if (isLoading) {
      return <p className="text-sm text-gray-500">Loading replies...</p>;
    }

    if (isError || replies === undefined) {
      return <p className="text-sm text-red-500">Could not load the replies</p>;
    }

    if (replies.length === 0) {
      return <p className="text-sm text-gray-500">No replies yet</p>;
    }

    return (
      <>
        {replies.map(function (reply) {
          return <CommentCard key={reply._id} comment={reply} />;
        })}

        {renderViewMore()}
      </>
    );
  }

  return <div className="space-y-3">{renderReplies()}</div>;
}