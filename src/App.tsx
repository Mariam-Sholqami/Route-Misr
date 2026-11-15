import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import AuthContextProvider from "../src/Context/AuthContextprovider";
import Layout from "./Layout/Layout";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import PostDetails from "./Pages/PostDetails/PostDetails";
import NotFound from "./Pages/NotFound/NotFound";
import Bookmarks from "./Pages/Bookmarks/Bookmarks";
import UserProfile from "./Pages/UserProfile/UserProfile";

/******* react-query *******/
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // A 4xx error (deleted post, no permission ...)=> we show the error at once
      retry: function (failureCount, error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

/******* routes *******/
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "posts/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "bookmarks",
        element: (
          <ProtectedRoute>
            <Bookmarks />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:userId",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Toaster />
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default App;