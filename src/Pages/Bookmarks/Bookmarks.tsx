import useBookmarks from "../../Hooks/useBookmarks";
import PostCard from "../../Components/PostCard/PostCard";
import Loader from "../../Components/Loader/Loader";

// the saved posts with the same PostCard as the feed
export default function Bookmarks() {
  const {
    data: posts,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useBookmarks();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || posts === undefined) {
    return (
      <p className="mx-auto my-8 max-w-xl rounded-2xl bg-red-50 px-6 py-3 text-red-600">
        {error?.message || "Could not load the saved posts"}
      </p>
    );
  }

  // "Load more posts" button=> if the API has more pages
  function renderLoadMore() {
    if (!hasNextPage) {
      return null;
    }

    let loadMoreText = "Load more posts";
    if (isFetchingNextPage) {
      loadMoreText = "Loading...";
    }

    return (
      <button
        type="button"
        onClick={function () {
          fetchNextPage();
        }}
        disabled={isFetchingNextPage}
        className="w-full rounded-full bg-white py-3 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 disabled:opacity-60"
      >
        {loadMoreText}
      </button>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="px-1 text-lg font-semibold">Saved posts</h1>

        {/* only say "nothing saved" when there are no more pages to check
            (a page can come back empty if the owner deleted the posts while the next pages still have some) */}
        {posts.length === 0 && !hasNextPage && (
          <p className="text-center text-gray-500">You haven't saved any posts yet</p>
        )}

        {posts.map(function (post) {
          return <PostCard key={post._id} post={{ ...post, bookmarked: true }} />;
        })}

        {renderLoadMore()}
      </div>
    </main>
  );
}