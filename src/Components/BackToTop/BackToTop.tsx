import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

//button to takes user back to the top
//the Home page uses it to refresh the posts
export default function BackToTop({ onGoTop }: { onGoTop?: () => void }) {
  // true after the user scrolled down a bit
  const [visible, setVisible] = useState(false);

  useEffect(function () {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }

    window.addEventListener("scroll", handleScroll);

    // stop listening when the page closes
    return function () {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function goTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onGoTop) {
      onGoTop();
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-6 right-6 z-30 rounded-full bg-blue-600 p-3 text-white shadow-lg transition hover:bg-blue-700"
    >
      <ArrowUp size={22} />
    </button>
  );
}