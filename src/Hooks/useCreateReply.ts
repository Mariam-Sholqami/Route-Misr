import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

export default function useCreateReply(postId: string, commentId: string) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendReply(formData: FormData) {
    const response = await axios.post(
      `${baseURL}/posts/${postId}/comments/${commentId}/replies`,
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
    mutationFn: sendReply,

    //refresh everything that shows it or counts it
    onSuccess: function () {
      toast.success("Reply added");

      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
      //(the number of replies of each comment)
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },

    onError: function (error) {
      let message = "Could not add the reply";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}