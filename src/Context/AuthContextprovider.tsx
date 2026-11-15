import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "./AuthContext";
import { baseURL } from "../api/api";
import type { IUserData } from "../interfaces/auth.interface";

/******* ContextProvider  *******/
const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(function () {
    return localStorage.getItem("token");
  });
  const [userData, setUserData] = useState<IUserData | null>(null);

  const [loadingUser, setLoadingUser] = useState<boolean>(token !== null);

  // after a successful login
  function insertUserToken(tkn: string) {
    setToken(tkn);
    setLoadingUser(true);
    localStorage.setItem("token", tkn);
  }

  // logout
  function logoutContext() {
    setToken(null);
    setUserData(null);
    setLoadingUser(false);
    localStorage.removeItem("token");
  }

  /******* get the user's data from  API *******/
  //after login and after every refresh
  useEffect(
    function () {
      if (token === null) {
        return;
      }

      async function fetchUserData() {
        try {
          const response = await axios.get(`${baseURL}/users/profile-data`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserData(response.data?.data?.user);
        } catch (error) {
          let message = "Something went wrong, please try again";

          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              // 401 = the token expired or is invalid=>logout
              setToken(null);
              setUserData(null);
              localStorage.removeItem("token");
              message = "Your session has expired, please login again";
            } else if (error.response?.data?.message) {
              // any other error=> keep the user loggedin
              message = error.response.data.message;
            }
          }

          //stop duplicated the toast massage
          toast.error(message, { id: "user-data-error" });
        } finally {
          setLoadingUser(false);
        }
      }

      fetchUserData();
    },
    [token]
  );

  return (
    <authContext.Provider
      value={{
        token,
        userData,
        loadingUser,
        insertUserToken,
        setUserData,
        logoutContext,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;