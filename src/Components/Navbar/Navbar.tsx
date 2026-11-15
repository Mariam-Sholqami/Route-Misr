import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Home } from "lucide-react";
import { authContext } from "../../Context/AuthContext";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import NotificationBell from "../NotificationBell/NotificationBell";
import { Avatar } from "@heroui/react";

const Navbar = () => {
  const { token, userData, loadingUser } = useContext(authContext);

  // hides when scrolling down and shows again when scrolling up
  const [hidden, setHidden] = useState(false);

  useEffect(function () {
    let lastY = window.scrollY;

    function handleScroll() {
      const y = window.scrollY;

      if (y > lastY && y > 80) {
        // going down hide it
        setHidden(true);
      } else if (y < lastY) {
        // going up: show it
        setHidden(false);
      }

      lastY = y;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return function () {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // sticky 
  let navClass = "sticky top-0 z-40 bg-white py-5 shadow-2xl transition-transform duration-300";
  if (hidden) {
    navClass += " -translate-y-full";
  }

  let profileItem = (
    <Link to="/profile" title={userData?.name}>
      <Avatar size="md">
        <Avatar.Image src={userData?.photo} alt="Profile photo" />
        <Avatar.Fallback>{userData?.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
      </Avatar>
    </Link>
  );
  if (loadingUser) {
    profileItem = (
      <div
        role="status"
        aria-label="Loading"
        className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
      />
    );
  }

  return (
    <nav className={navClass}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Social
        </Link>

        <ul className="flex items-center gap-4 sm:gap-6">
          {token ? (
            <>
              <li>
                {/*home icon */}
                <NavLink
                  to="/"
                  end
                  aria-label="Home"
                  title="Home"
                  className={function ({ isActive }) {
                    if (isActive) {
                      return "block rounded-full p-2 text-blue-600 transition hover:bg-gray-100";
                    }
                    return "block rounded-full p-2 transition hover:bg-gray-100";
                  }}
                >
                  <Home size={22} />
                </NavLink>
              </li>
              <li>
                <NotificationBell />
              </li>
              <li>{profileItem}</li>
              <li>
                <SettingsMenu />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;