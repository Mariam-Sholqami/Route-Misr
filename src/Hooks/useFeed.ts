import { useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import { mergeUniqueById, nextPageOf } from "../utils/pagination";
import type { IListPage, IPost } from "../interfaces/posts.interface";

// FOLLOWING FEED
// photosOnly = true => the same feed, but only the posts that have an image 


// The API includes my own posts in the Following feed
// we can filter out my posts using the current user's ID inside fetchFeedPage:
// const { token, userData } = useContext(authContext);
// in the returned object:
// items: response.data.data.posts.filter(function (post: IPost) {
//        return post.user._id !== userData?._id;
// }),
// then a page can  have less than 20 posts or empty,
// so "Load more" can look like it does nothing until the next page arrives. we can fix it partially with=>
// useEffect(function () {
//   if (posts && posts.length === 0 && hasNextPage && !isFetchingNextPage) {
//     fetchNextPage();
//   }
// }, [posts, hasNextPage, isFetchingNextPage, fetchNextPage]);


export default function useFeed(photosOnly: boolean = false, enabled: boolean = true) {
  const { token } = useContext(authContext);

  // gets ONE page of the feed
  async function fetchFeedPage(page: number): Promise<IListPage<IPost>> {
    // always only=following
    const params: Record<string, string | number | boolean> = { only: "following", page };
    if (photosOnly) {
      params.hasImage = true;
    }

    const response = await axios.get(`${baseURL}/posts/feed`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const pagination = response.data.meta?.pagination;
    return {
      items: response.data.data.posts,
      currentPage: pagination?.currentPage ?? page,
      //If pagination data is missing, treat the current page as the last page
      numberOfPages: pagination?.numberOfPages ?? page,
    };
  }

  return useInfiniteQuery({
    // refresh 
    // photosOnly is in the key=> each version has its own cache
    queryKey: ["posts", "feed", photosOnly, token],
    queryFn: function ({ pageParam }) {
      return fetchFeedPage(pageParam);
    },
    initialPageParam: 1, 
    getNextPageParam: nextPageOf,
    select: function (data) {
      return mergeUniqueById(data.pages);
    },
    enabled: token !== null && enabled,
  });
}