import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import type { IUserProfile } from "../interfaces/profile.interface";

// the profile of ANOTHER user
export default function useUserProfile(userId: string | undefined) {
  const { token } = useContext(authContext);

  async function fetchUserProfile(): Promise<IUserProfile> {
    const response = await axios.get(`${baseURL}/users/${userId}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  }

  return useQuery({
    queryKey: ["userProfile", userId, token],
    queryFn: fetchUserProfile,
    enabled: token !== null && userId !== undefined,
  });
}