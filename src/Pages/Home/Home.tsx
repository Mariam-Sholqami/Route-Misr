import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import usePosts from "../../Hooks/usePosts";
import useFeed from "../../Hooks/useFeed";
import PostCard from "../../Components/PostCard/PostCard";
import Loader from "../../Components/Loader/Loader";
import CreatePost from "../../Components/CreatePost/CreatePost";
import BackToTop from "../../Components/BackToTop/BackToTop";
import PeopleYouMayKnow from "../../Components/PeopleYouMayKnow/PeopleYouMayKnow";

// the two tabs above the feed
type FeedTab = "all" | "following";

const tabs: { value: FeedTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "following", label: "Following" },
];

// "People you may know" shows after second post in the "All" tab or after the last post if it is less
const SUGGESTIONS_AFTER = 2;

export default function Home() {
  const queryClient = useQueryClient();

  // the open tab and the photos filter are kept in the address
  // they stay after a refresh and when the user comes back from a post page with the Back button
  const [searchParams, setSearchParams] = useSearchParams();

  let tab: FeedTab = "all";
  if (searchParams.get("feed") === "following") {
    tab = "following";
  }

  // the photos filter only exists inside the Following tab
  let photosOnly = false;
  if (tab === "following" && searchParams.get("photos") === "true") {
    photosOnly = true;
  }

  function changeTab(next: FeedTab) {
    if (next === "all") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ feed: "following" }, { replace: true });
    }
  }

  function togglePhotos() {
    if (photosOnly) {
      setSearchParams({ feed: "following" }, { replace: true });
    } else {
      setSearchParams({ feed: "following", photos: "true" }, { replace: true });
    }
  }

  // "All"=> (GET /posts).
  // "Following" => (GET /posts/feed?only=following), with &hasImage=true when photosOnly is on.
  const allPosts = usePosts(tab === "all");
  const feed = useFeed(photosOnly, tab === "following");

  let query = feed;
  if (tab === "all") {
    query = allPosts;
  }
  const {
    data: posts,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = query;

  function refreshPosts() {
    queryClient.resetQueries({ queryKey: ["posts"] });
  }

  // message when there are no posts
  let emptyMessage = "No posts yet";
  if (tab === "following") {
    emptyMessage = "No posts from the people you follow yet";
  }
  if (photosOnly) {
    emptyMessage = "No posts with photos from the people you follow yet";
  }

  function renderPosts() {
    if (isLoading) {
      return <Loader />;
    }

    if (isError || posts === undefined) {
      return (
        <p className="rounded-2xl bg-red-50 px-6 py-3 text-red-600">
          {error?.message || "Could not load the posts"}
        </p>
      );
    }

    // nothing to show: in the Following tab this is the best place to suggest people to follow
    if (posts.length === 0) {
      return (
        <>
          <p className="text-center text-gray-500">{emptyMessage}</p>
          {tab === "following" && <PeopleYouMayKnow />}
        </>
      );
    }

    // the index of the post that the suggestions come after (only in the "All" tab)
    const suggestionsIndex = Math.min(SUGGESTIONS_AFTER, posts.length) - 1;

    return posts.map(function (post, index) {
      return (
        <Fragment key={post._id}>
          <PostCard post={post} />
          {tab === "all" && index === suggestionsIndex && <PeopleYouMayKnow />}
        </Fragment>
      );
    });
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

  // "Photos only" filter =>  shown only inside the Following tab
  function renderPhotosFilter() {
    if (tab !== "following") {
      return null;
    }

    let filterClass =
      "rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-100";
    if (photosOnly) {
      filterClass =
        "rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm";
    }

    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={togglePhotos}
          aria-pressed={photosOnly}
          className={filterClass}
        >
          Photos only
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-xl space-y-6 lg:max-w-2xl">
        {/* write a new post */}
        <CreatePost />

        {/* the tabs */}
        <div className="flex gap-2">
          {tabs.map(function (item) {
            let tabClass =
              "rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-100";
            if (item.value === tab) {
              tabClass =
                "rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm";
            }

            return (
              <button
                key={item.value}
                type="button"
                onClick={function () {
                  changeTab(item.value);
                }}
                className={tabClass}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* the photos filter only inside Following */}
        {renderPhotosFilter()}

        {renderPosts()}

        {renderLoadMore()}
      </div>

      {/* back to top and refresh */}
      <BackToTop onGoTop={refreshPosts} />
    </main>
  );
}