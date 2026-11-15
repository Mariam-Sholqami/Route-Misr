import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import type { IPost } from "../interfaces/posts.interface";

export default function usePost(id: string | undefined) {
  const { token } = useContext(authContext);

  async function fetchPost(): Promise<IPost> {
    const response = await axios.get(`${baseURL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.post;
  }

  return useQuery({
    queryKey: ["post", id, token],
    queryFn: fetchPost,
    enabled: token !== null && id !== undefined,
  });
}