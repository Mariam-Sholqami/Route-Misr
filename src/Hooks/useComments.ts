import { useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import { mergeUniqueById, nextPageOf } from "../utils/pagination";
import type { IComment, IListPage } from "../interfaces/posts.interface";

// the comments of one post
export default function useComments(id: string | undefined) {
  const { token } = useContext(authContext);

  // gets ONE page of comments
  async function fetchCommentsPage(page: number): Promise<IListPage<IComment>> {
    const response = await axios.get(`${baseURL}/posts/${id}/comments`, {
      params: { page, limit: 10 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const pagination = response.data.meta?.pagination;
    return {
      items: response.data.data.comments,
      currentPage: pagination?.currentPage ?? page,
      //If pagination data is missing, treat the current page as the last page
      numberOfPages: pagination?.numberOfPages ?? page,
    };
  }

  return useInfiniteQuery({
    queryKey: ["comments", id, token],
    queryFn: function ({ pageParam }) {
      return fetchCommentsPage(pageParam);
    },
    initialPageParam: 1, 
    getNextPageParam: nextPageOf,
    select: function (data) {
      return mergeUniqueById(data.pages);
    },
    enabled: token !== null && id !== undefined,
  });
}