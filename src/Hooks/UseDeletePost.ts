import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

export default function useDeletePost(postId: string) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  // DELETE
  async function sendDelete() {
    const response = await axios.delete(`${baseURL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendDelete,

    // refresh 
    onSuccess: function () {
      toast.success("Post deleted");

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },

    onError: function (error) {
      let message = "Could not delete the post";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}