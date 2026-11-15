import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

export default function useSharePost(postId: string) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendShare(body: string) {
    // when the user wrote nothing we send no body 
    const data: { body?: string } = {};
    if (body !== "") {
      data.body = body;
    }

    const response = await axios.post(`${baseURL}/posts/${postId}/share`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendShare,

    //refresh the feed and the profil and the original post (its shares counter)
    onSuccess: function () {
      toast.success("Post shared");

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },

    onError: function (error) {
      let message = "Could not share the post";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}