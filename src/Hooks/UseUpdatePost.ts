import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

// the post id is a parameter of the hook
export default function useUpdatePost(postId: string) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  // { body, image (optional) }
  // The image is optional: we can replace an existing image, but cannot remove it
  async function sendUpdate(formData: FormData) {
    const response = await axios.put(`${baseURL}/posts/${postId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendUpdate,

    //refresh everything that shows it
    onSuccess: function () {
      toast.success("Post updated");

      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },

    onError: function (error) {
      let message = "Could not update the post";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}