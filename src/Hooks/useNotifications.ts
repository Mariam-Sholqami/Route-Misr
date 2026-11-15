import { useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import { mergeUniqueById, nextPageOf } from "../utils/pagination";
import type { IListPage } from "../interfaces/posts.interface";
import type { INotification } from "../interfaces/notifications.interface";

// enabled = false until the bell is opened
export default function useNotifications(enabled: boolean) {
  const { token } = useContext(authContext);

  // gets ONE page of notifications
  async function fetchNotificationsPage(page: number): Promise<IListPage<INotification>> {
    const response = await axios.get(`${baseURL}/notifications`, {
      // Based on API testing:
      // unread=false returns only unread notifications.
      // unread=true or omitting the unread parameter returns all notifications.
      params: { page, limit: 10 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const pagination = response.data.meta?.pagination;
    return {
      items: response.data.data.notifications,
      currentPage: pagination?.currentPage ?? page,
      //If pagination data is missing, treat the current page as the last page
      numberOfPages: pagination?.numberOfPages ?? page,
    };
  }

  return useInfiniteQuery({
    //refreshes
    queryKey: ["notifications", "list", token],
    queryFn: function ({ pageParam }) {
      return fetchNotificationsPage(pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    select: function (data) {
      return mergeUniqueById(data.pages);
    },
    enabled: token !== null && enabled,
  });
}