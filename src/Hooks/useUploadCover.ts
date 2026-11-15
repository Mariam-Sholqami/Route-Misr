import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

// change the cover photo
// PUT /users/upload-cover with the field "cover" 
// It works like "Upload Profile Photo
export default function useUploadCover() {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendCover(formData: FormData) {
    const response = await axios.put(`${baseURL}/users/upload-cover`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendCover,

    onSuccess: function () {
      toast.success("Cover photo updated");

      //refresh the profiles and the posts 
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },

    onError: function (error) {
      let message = "Could not update the cover photo";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}