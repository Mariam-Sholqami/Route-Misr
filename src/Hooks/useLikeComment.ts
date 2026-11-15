import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

// like / unlike a comment: the same request does both
export default function useLikeComment(postId: string, commentId: string) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendLike() {
    const response = await axios.put(
      `${baseURL}/posts/${postId}/comments/${commentId}/like`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  return useMutation({
    mutationFn: sendLike,

    // refresh everything that shows this comment
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      // the replies lists (a reply is a comment too, so this hook is also used for replies)
      queryClient.invalidateQueries({ queryKey: ["replies"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },

    onError: function (error) {
      let message = "Could not like the comment";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}