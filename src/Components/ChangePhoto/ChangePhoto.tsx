import { useContext, useRef, useState } from "react";
import { Avatar } from "@heroui/react";
import { ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { authContext } from "../../Context/AuthContext";
import useUploadPhoto from "../../Hooks/useUploadPhoto";


const ChangePhoto = ({ onDone }: { onDone: () => void }) => {
  const { userData } = useContext(authContext);

  const photoInput = useRef<HTMLInputElement>(null);

  // the preview of the chosen photo
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate, isPending } = useUploadPhoto();

  
  function handlePhoto() {
    const file = photoInput.current?.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  function savePhoto() {
    const file = photoInput.current?.files?.[0];

    if (!file) {
      toast.error("Choose a photo first");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    mutate(formData, {
      onSuccess: function () {
        onDone();
      },
    });
  }

  let shownPhoto = userData?.photo;
  if (preview) {
    shownPhoto = preview;
  }

  let saveText = "Save";
  if (isPending) {
    saveText = "Saving...";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3">
        <Avatar className="size-28 text-3xl">
          <Avatar.Image src={shownPhoto} alt="Profile photo" />
          <Avatar.Fallback>{userData?.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
        </Avatar>

        <input
          ref={photoInput}
          type="file"
          accept="image/*"
          onChange={handlePhoto}
          className="hidden"
        />
        <button
          type="button"
          onClick={function () {
            photoInput.current?.click();
          }}
          disabled={isPending}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ImagePlus size={18} />
          Choose a photo
        </button>
      </div>

      <div className="flex justify-end gap-3 text-sm font-medium">
        <button
          type="button"
          onClick={onDone}
          disabled={isPending}
          className="rounded-full px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={savePhoto}
          disabled={isPending}
          className="rounded-full bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {saveText}
        </button>
      </div>
    </div>
  );
};

export default ChangePhoto;