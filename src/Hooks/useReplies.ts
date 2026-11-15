import { useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import { mergeUniqueById, nextPageOf } from "../utils/pagination";
import type { IComment, IListPage } from "../interfaces/posts.interface";


export default function useReplies(postId: string, commentId: string) {
  const { token } = useContext(authContext);

  // gets ONE page of replies
  async function fetchRepliesPage(page: number): Promise<IListPage<IComment>> {
    const response = await axios.get(
      `${baseURL}/posts/${postId}/comments/${commentId}/replies`,
      {
        params: { page, limit: 10 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const pagination = response.data.meta?.pagination;
    return {
      items: response.data.data.replies,
      currentPage: pagination?.currentPage ?? page,
      //If pagination data is missing, treat the current page as the last page
      numberOfPages: pagination?.numberOfPages ?? page,
    };
  }

  return useInfiniteQuery({
    queryKey: ["replies", commentId, token],
    queryFn: function ({ pageParam }) {
      return fetchRepliesPage(pageParam);
    },
    initialPageParam: 1, // start with page 1
    getNextPageParam: nextPageOf,
    select: function (data) {
      return mergeUniqueById(data.pages);
    },
    enabled: token !== null,
  });
}