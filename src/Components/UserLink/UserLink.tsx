import { useContext } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { authContext } from "../../Context/AuthContext";

// a link to the profile of a user=> wrap his photo or his name ,.... 
export default function UserLink({
  userId,
  children,
  className,
  onClick,
}: {
  userId: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { userData } = useContext(authContext);

  let path = `/users/${userId}`;

  // my own profile has its own page
  if (userData?._id === userId) {
    path = "/profile";
  }

  return (
    <Link to={path} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}