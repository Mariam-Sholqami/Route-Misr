import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import type { IChangePasswordObject } from "../interfaces/auth.interface";

export default function useChangePassword() {
  const { token, insertUserToken, logoutContext } = useContext(authContext);

  async function sendPassword(values: IChangePasswordObject) {
    const response = await axios.patch(`${baseURL}/users/change-password`, values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  return useMutation({
    mutationFn: sendPassword,

    onSuccess: function (data) {
      const newToken = data?.data?.token;

      if (newToken) {
        insertUserToken(newToken);
        toast.success("Password changed");
      } else {
        // no token came back=> login again
        logoutContext();
        toast.success("Password changed, please login again");
      }
    },

    onError: function (error) {
      let message = "Could not change the password";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}