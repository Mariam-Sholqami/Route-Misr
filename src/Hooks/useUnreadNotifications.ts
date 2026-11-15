import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

export default function useUnreadNotifications() {
  const { token } = useContext(authContext);

  async function fetchUnreadCount(): Promise<number> {
    const response = await axios.get(`${baseURL}/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.unreadCount;
  }

  return useQuery({
    queryKey: ["notifications", "unreadCount", token],
    queryFn: fetchUnreadCount,
    enabled: token !== null,
    // check again every 30 seconds
    refetchInterval: 30000,
  });
}