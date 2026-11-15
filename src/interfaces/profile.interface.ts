/******* a follower inside the profile of another user *******/
export interface IProfileFollower {
  _id: string;
  name: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}

/******* the profile of ANOTHER user *******/
export interface IProfileUser {
  _id: string;
  id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
  cover: string; 
  dateOfBirth: string;
  gender: string;
  createdAt: string;
  followers: IProfileFollower[];
  following: IProfileFollower[]; 
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
}

/******* data of UserProfile *******/
export interface IUserProfile {
  isFollowing: boolean; 
  user: IProfileUser;
}

/******* one person of FollowSuggestion *******/
export interface IFollowSuggestion {
  _id: string;
  name: string;
  username: string;
  photo: string;
  mutualFollowersCount: number; 
  followersCount: number;
}