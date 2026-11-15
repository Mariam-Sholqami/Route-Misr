import { useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import { mergeUniqueById, nextPageOf } from "../utils/pagination";
import type { IListPage, IPost } from "../interfaces/posts.interface";

// enabled => the Home page needs it to switch on the "All" tab
export default function usePosts(enabled: boolean = true) {
  const { token } = useContext(authContext);

  // gets ONE page of posts
  async function fetchPostsPage(page: number): Promise<IListPage<IPost>> {
    const response = await axios.get(`${baseURL}/posts`, {
      params: { page },
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
    //refresh 
    queryKey: ["posts", "all", token],
    queryFn: function ({ pageParam }) {
      return fetchPostsPage(pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    select: function (data) {
      return mergeUniqueById(data.pages);
    },
    enabled: token !== null && enabled, // no token or switched off => no request
  });
}