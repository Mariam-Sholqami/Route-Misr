import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

// mark ALL the notifications as read
export default function useMarkAllNotificationsRead() {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendMarkAllRead() {
    const response = await axios.patch(`${baseURL}/notifications/read-all`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendMarkAllRead,

    // refresh the list and the red number
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },

    onError: function () {
      toast.error("Could not mark the notifications as read");
    },
  });
}