import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

export default function useDeleteComment(postId: string, commentId: string) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendDelete() {
    // DELETE 
    const response = await axios.delete(
      `${baseURL}/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  return useMutation({
    mutationFn: sendDelete,

    //refresh everything that shows it (the list and the counts)
    onSuccess: function () {
      toast.success("Comment deleted");

      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      // the replies lists => this hook is also used for replies
      queryClient.invalidateQueries({ queryKey: ["replies"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // the posts of the profile page => (they show the first comment too)
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },

    onError: function (error) {
      let message = "Could not delete the comment";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}