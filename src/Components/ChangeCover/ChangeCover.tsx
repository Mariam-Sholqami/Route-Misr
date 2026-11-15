import { useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";
import { authContext } from "../../Context/AuthContext";
import useUploadCover from "../../Hooks/useUploadCover";
import useUserProfile from "../../Hooks/useUserProfile";

export default function ChangeCover({ onDone }: { onDone: () => void }) {
  const { userData } = useContext(authContext);

  const inputRef = useRef<HTMLInputElement>(null);

  // the image the user chose
  const [file, setFile] = useState<File | null>(null);
  //show it before saving
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate: uploadCover, isPending } = useUploadCover();

  //current cover comes from my profile 
  const { data: myProfile } = useUserProfile(userData?._id);

  function handleChoose() {
    const chosen = inputRef.current?.files?.[0];
    if (!chosen) {
      return;
    }

    if (!chosen.type.startsWith("image/")) {
      toast.error("Please choose an image");
      return;
    }

    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  }

  function handleSave() {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("cover", file);

    uploadCover(formData, { onSuccess: onDone });
  }

  // the chosen image if there is one, otherwise the current cover
  let shownCover = myProfile?.user.cover;
  if (preview) {
    shownCover = preview;
  }

  // when no image to show
  let emptyText = "No cover photo yet";
  if (myProfile === undefined) {
    emptyText = "Loading...";
  }

  let saveText = "Save";
  if (isPending) {
    saveText = "Saving...";
  }

  return (
    <div className="space-y-4">
      
      <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
        {shownCover ? (
          <img src={shownCover} alt="Cover" className="h-full w-full object-cover" />
        ) : (
          <p className="text-sm text-gray-500">{emptyText}</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChoose}
        className="hidden"
      />

      <button
        type="button"
        onClick={function () {
          inputRef.current?.click();
        }}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-60"
      >
        <ImagePlus size={18} />
        Choose image
      </button>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          disabled={isPending}
          className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!file || isPending}
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {saveText}
        </button>
      </div>
    </div>
  );
}