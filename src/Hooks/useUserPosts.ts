import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { baseURL } from "../api/api";
import type { IPost } from "../interfaces/posts.interface";

// posts + total number 
interface IUserPostsData {
  posts: IPost[];
  total: number;
}

// the posts of one user ( my profile page and profile page of another user)
// It always sends the latest 40 posts,by testing the API doesn't paginate this endpoint: it ignores page and limit
export default function useUserPosts(userId: string | undefined) {
  const { token } = useContext(authContext);

  async function fetchUserPosts(): Promise<IUserPostsData> {
    const response = await axios.get(`${baseURL}/users/${userId}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const posts: IPost[] = response.data.data.posts;

    return {
      posts,
      total: response.data.meta?.pagination?.total ?? posts.length,
    };
  }

  return useQuery({
    queryKey: ["userPosts", userId, token],
    queryFn: fetchUserPosts,
    enabled: token !== null && userId !== undefined,
  });
}