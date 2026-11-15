import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

// mark ONE notification as read
export default function useMarkNotificationRead() {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendMarkRead(notificationId: string) {

    const response = await axios.patch(`${baseURL}/notifications/${notificationId}/read`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendMarkRead,

    // refresh the list and the red number
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}