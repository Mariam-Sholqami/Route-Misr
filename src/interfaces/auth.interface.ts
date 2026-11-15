/******* register *******/
export interface IRegisterObject {
  name: string;
  username: string;
  email: string;
  password: string;
  rePassword: string;
  dateOfBirth: string;
  gender: string;
}

/******* login *******/
export interface ILoginObject {
  email: string;
  password: string;
}

/******* auth context *******/
export interface IAuthContext {
  token: string | null;
  userData: IUserData | null;
  loadingUser: boolean;
  insertUserToken: (tkn: string) => void;
  setUserData: (user: IUserData | null) => void;
  logoutContext: () => void;
}

/******* user  *******/
export interface IUserData {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
  cover: string; 
  dateOfBirth: string;
  gender: string;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  following?: string[]; 
  followers?: string[]; 
}

/******* change password *******/
export interface IChangePasswordObject {
  password: string; 
  newPassword: string;
}

export interface IChangePasswordForm extends IChangePasswordObject {
  rePassword: string;
}