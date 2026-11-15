import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

// save / unsave 
export default function useBookmarkPost(postId: string) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendBookmark() {
    
    const response = await axios.put(`${baseURL}/posts/${postId}/bookmark`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendBookmark,

    // refresh 
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },

    onError: function (error) {
      let message = "Could not save the post";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}