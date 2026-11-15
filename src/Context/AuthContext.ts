import { createContext } from "react";
import type { IAuthContext } from "../interfaces/auth.interface";
 
/******* the context (what other components read) *******/
// default values are only used if a component is rendered outside the Provider
export const authContext = createContext<IAuthContext>({
  token: null,
  userData: null,
  loadingUser: false,
  insertUserToken: function () {},
  setUserData: function () {},
  logoutContext: function () {},
});
 