import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

// like / unlike a post: the same request does both
export default function useLikePost(postId: string) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendLike() {
    const response = await axios.put(`${baseURL}/posts/${postId}/like`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendLike,

    // refresh everything that shows the likes of this post
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },

    onError: function (error) {
      let message = "Could not like the post";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}