import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import type { IFollowSuggestion } from "../interfaces/profile.interface";

// people you may know
//ask for the first page
export default function useFollowSuggestions(limit: number = 10) {
  const { token } = useContext(authContext);

  async function fetchSuggestions(): Promise<IFollowSuggestion[]> {
    const response = await axios.get(`${baseURL}/users/suggestions`, {
      params: { limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.suggestions;
  }

  return useQuery({
    queryKey: ["suggestions", limit, token],
    queryFn: fetchSuggestions,
    enabled: token !== null,
  });
}