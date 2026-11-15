import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Camera, Image as ImageIcon, Lock, LogOut, Menu } from "lucide-react";
import { authContext } from "../../Context/AuthContext";
import Modal from "../Modal/Modal";
import ChangePhoto from "../ChangePhoto/ChangePhoto";
import ChangeCover from "../ChangeCover/ChangeCover";
import ChangePassword from "../ChangePassword/ChangePassword";

// settings
export default function SettingsMenu() {
  const { logoutContext } = useContext(authContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [openWindow, setOpenWindow] = useState<"photo" | "cover" | "password" | null>(null);

  // an item of the list was pressed=> close the list and open its window
  function openItem(item: "photo" | "cover" | "password") {
    setMenuOpen(false);
    setOpenWindow(item);
  }

  function closeWindow() {
    setOpenWindow(null);
  }

  // Logout => clear the token then go to the login page
  function logout() {
    setMenuOpen(false);
    logoutContext();
    navigate("/login");
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Settings"
        onClick={function () {
          setMenuOpen(!menuOpen);
        }}
        className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
      >
        <Menu size={22} />
      </button>

      {menuOpen && (
        <>
          {/* an invisible layer over the page=>click anywhere outside the list closes it */}
          <div
            className="fixed inset-0 z-10"
            onClick={function () {
              setMenuOpen(false);
            }}
          />

          <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-100">
            <Link
              to="/bookmarks"
              onClick={function () {
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              <Bookmark size={18} />
              Saved posts
            </Link>
            <button
              type="button"
              onClick={function () {
                openItem("photo");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              <Camera size={18} />
              Change profile photo
            </button>
            <button
              type="button"
              onClick={function () {
                openItem("cover");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              <ImageIcon size={18} />
              Change cover photo
            </button>
            <button
              type="button"
              onClick={function () {
                openItem("password");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              <Lock size={18} />
              Change password
            </button>

            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </>
      )}

      <Modal
        open={openWindow === "photo"}
        title="Change profile photo"
        onClose={closeWindow}
      >
        <ChangePhoto onDone={closeWindow} />
      </Modal>

      <Modal
        open={openWindow === "cover"}
        title="Change cover photo"
        onClose={closeWindow}
      >
        <ChangeCover onDone={closeWindow} />
      </Modal>

      <Modal
        open={openWindow === "password"}
        title="Change password"
        onClose={closeWindow}
      >
        <ChangePassword onDone={closeWindow} />
      </Modal>
    </div>
  );
}