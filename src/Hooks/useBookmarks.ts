import { useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import { mergeUniqueById, nextPageOf } from "../utils/pagination";
import type { IListPage, IPost } from "../interfaces/posts.interface";

// the posts the user saved
export default function useBookmarks() {
  const { token } = useContext(authContext);

  // gets ONE page of bookmarks
  async function fetchBookmarksPage(page: number): Promise<IListPage<IPost>> {
    const response = await axios.get(`${baseURL}/users/bookmarks`, {
      params: { page },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const pagination = response.data.meta?.pagination;
    return {
      items: response.data.data.bookmarks,
      currentPage: pagination?.currentPage ?? page,
      //If pagination data is missing, treat the current page as the last page
      numberOfPages: pagination?.numberOfPages ?? page,
    };
  }

  return useInfiniteQuery({
    queryKey: ["bookmarks", token],
    queryFn: function ({ pageParam }) {
      return fetchBookmarksPage(pageParam);
    },
    initialPageParam: 1, 
    getNextPageParam: nextPageOf,
    select: function (data) {
      return mergeUniqueById(data.pages);
    },
    enabled: token !== null,
  });
}