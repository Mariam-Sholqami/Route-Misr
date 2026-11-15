import { useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import { mergeUniqueById, nextPageOf } from "../utils/pagination";
import type { IListPage, IPostUser } from "../interfaces/posts.interface";

// the people who liked a postn => when the likes window is open 
export default function useLikes(id: string, open: boolean) {
  const { token } = useContext(authContext);

  // gets ONE page of likes
  async function fetchLikesPage(page: number): Promise<IListPage<IPostUser>> {
    const response = await axios.get(`${baseURL}/posts/${id}/likes`, {
      params: { page, limit: 20 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const pagination = response.data.meta?.pagination;
    return {
      items: response.data.data.likes,
      currentPage: pagination?.currentPage ?? page,
      //If pagination data is missing, treat the current page as the last page
      numberOfPages: pagination?.numberOfPages ?? page,
    };
  }

  return useInfiniteQuery({
    queryKey: ["likes", id, token],
    queryFn: function ({ pageParam }) {
      return fetchLikesPage(pageParam);
    },
    initialPageParam: 1, 
    getNextPageParam: nextPageOf,
    select: function (data) {
      return mergeUniqueById(data.pages);
    },
    enabled: token !== null && open,
  });
}