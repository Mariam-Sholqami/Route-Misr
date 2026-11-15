import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(
    function () {
      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      if (open && !dialog.open) {
        dialog.showModal();
      }
      if (!open && dialog.open) {
        dialog.close();
      }
    },
    [open]
  );

  return (
    <dialog
      ref={dialogRef}
      //  Esc and dialog.close()
      onClose={onClose}
      onClick={function (e) {
        //click on the dark background closes it
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="m-auto w-full max-w-md rounded-2xl p-0 backdrop:bg-black/50"
    >
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {open && children}
      </div>
    </dialog>
  );
}