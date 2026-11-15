import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";

// follow / unfollow a user: the same request does both
export default function useFollowUser(userId: string) {
  const { token, userData, setUserData } = useContext(authContext);
  const queryClient = useQueryClient();

  async function sendFollow() {
    const response = await axios.put(`${baseURL}/users/${userId}/follow`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
  function updateMyFollowing(isNowFollowing: boolean) {
    if (userData === null) {
      return;
    }

    // remove his id first, then add it only if the server says I follow him now
    let newFollowing = (userData.following ?? []).filter(function (id) {
      return id !== userId;
    });
    if (isNowFollowing) {
      newFollowing = [...newFollowing, userId];
    }

    setUserData({
      ...userData,
      following: newFollowing,
      followingCount: newFollowing.length,
    });
  }
  //or by call my own data API  again
  //   async function sendFollow() {
  //   const headers = { Authorization: Bearer ${token} };
  //   await axios.put(${baseURL}/users/${userId}/follow, null, { headers });
  //   try {
  //     const response = await axios.get(${baseURL}/users/profile-data, { headers });
  //     return response.data.data.user;
  //   } catch {
  //     return null;
  //   }
  // }

  return useMutation({
    mutationFn: sendFollow,

    onSuccess: function (response) {
      updateMyFollowing(response.data.following);

      // refresh: the "Following" feed, the posts of the profiles, and the profile pages (the counts change)
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },

    onError: function (error) {
      let message = "Could not follow the user";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });
}