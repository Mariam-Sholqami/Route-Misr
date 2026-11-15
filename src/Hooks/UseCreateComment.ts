import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

export default function useCreateComment(postId: string) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendComment(formData: FormData) {
    const response = await axios.post(`${baseURL}/posts/${postId}/comments`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendComment,

    // refresh everything that shows it
    onSuccess: function () {
      toast.success("Comment added");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      // comments count and first comment
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    
    onError: function (error) {
      let message = "Could not add the comment";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}