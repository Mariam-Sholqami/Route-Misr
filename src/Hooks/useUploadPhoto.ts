import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

export default function useUploadPhoto() {
  const { token, setUserData } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendPhoto(formData: FormData) {
    const response = await axios.put(`${baseURL}/users/upload-photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendPhoto,

    onSuccess: async function () {
      toast.success("Profile photo updated");

      // refresh user's data in the context 
      try {
        const response = await axios.get(`${baseURL}/users/profile-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data?.data?.user);
      } catch {
        // Ignore profile refresh error: the new photo will show at the next refresh
      }

      // refresh everything
      queryClient.invalidateQueries();
    },

    onError: function (error) {
      let message = "Could not update the photo";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}