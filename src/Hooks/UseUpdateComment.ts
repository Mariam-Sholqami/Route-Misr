import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

export default function useUpdateComment(postId: string, commentId: string) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendUpdate(formData: FormData) {
    // { content, image (optional) }
    //  // The image is optional: we can replace an existing image, but cannot remove it
    const response = await axios.put(
      `${baseURL}/posts/${postId}/comments/${commentId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  return useMutation({
    mutationFn: sendUpdate,

    //refresh everything that shows it
    onSuccess: function () {
      toast.success("Comment updated");

      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },

    onError: function (error) {
      let message = "Could not update the comment";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}