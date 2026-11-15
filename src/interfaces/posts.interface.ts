/******* the user inside a post / comment *******/
export interface IPostUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

/******* comment *******/
export interface IComment {
  _id: string;
  content?: string; 
  image?: string; 
  commentCreator: IPostUser;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
  repliesCount?: number; 
}

/******* post *******/
export interface IPost {
  _id: string;
  id: string;
  body?: string; 
  image?: string; 
  privacy: string;
  user: IPostUser;
  sharedPost: IPost | null; 
  likes: string[]; 
  createdAt: string;
  commentsCount: number;
  topComment: IComment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  bookmarked?: boolean;
  unavailable?: boolean; // only inside a sharedPost: true when the original post was deleted 
}

/******* one page of a list  *******/
export interface IListPage<T> {
  items: T[];
  currentPage: number;
  numberOfPages: number;
}