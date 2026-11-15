import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import useUpdatePost from "../../Hooks/UseUpdatePost";
import type { IPost } from "../../interfaces/posts.interface";

// the edit form of a post
// the text is always required, at least 1 character
// the image can only be CHANGED, it can't be removed
export default function PostEditor({
  post,
  onDone,
}: {
  post: IPost;
  onDone: () => void;
}) {
  const editBody = useRef<HTMLTextAreaElement>(null);
  const editImage = useRef<HTMLInputElement>(null);

  const [newPreview, setNewPreview] = useState<string | null>(null);

  const { mutate, isPending } = useUpdatePost(post._id);

  // when chose an image=> replaces the one that is shown
  function handleImage() {
    const file = editImage.current?.files?.[0];
    if (file) {
      if (newPreview) {
        URL.revokeObjectURL(newPreview);
      }
      setNewPreview(URL.createObjectURL(file));
    }
  }

  //cancel =>the old image (if any) is shown again
  function cancelNewImage() {
    if (newPreview) {
      URL.revokeObjectURL(newPreview);
    }
    setNewPreview(null);

    // the file input still holds the new file, so we empty it too
    if (editImage.current) {
      editImage.current.value = "";
    }
  }

  // leave edit mode => Cancel, Esc, or after successful save
  function closeEditor() {
    if (newPreview) {
      URL.revokeObjectURL(newPreview);
    }
    onDone();
  }

  function saveEdit() {
    const body = editBody.current?.value.trim() ?? "";
    const newImage = editImage.current?.files?.[0];

    // the API needs a text (even when the post has an image)
    if (body === "") {
      toast.error("The post can't be empty");
      return;
    }

    const formData = new FormData();
    formData.append("body", body);

   
    if (newImage) {
      formData.append("image", newImage);
    }

    mutate(formData, {
      onSuccess: function () {
        closeEditor();
      },
    });
  }

  // the new image if there is one otherwise the current image of the post
  let shownImage = post.image;
  if (newPreview) {
    shownImage = newPreview;
  }

  let photoButtonText = "Add photo";
  if (shownImage) {
    photoButtonText = "Change photo";
  }

  let saveText = "Save";
  if (isPending) {
    saveText = "Saving...";
  }

  return (
    <div className="space-y-3 px-5">
      <textarea
        ref={editBody}
        defaultValue={post.body}
        placeholder="Write something..."
        rows={3}
        autoFocus
        disabled={isPending}
        onKeyDown={function (e) {
          // Esc cancels
          if (e.key === "Escape") {
            closeEditor();
          }
        }}
        className="w-full resize-none rounded-2xl bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* current one or the new one with an X to cancel the change */}
      {shownImage && (
        <div className="relative inline-block">
          <img src={shownImage} alt="Post" className="max-h-72 rounded-xl object-cover" />
          {newPreview && (
            <button
              type="button"
              aria-label="Cancel the new image"
              onClick={cancelNewImage}
              disabled={isPending}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 text-sm font-medium">
        {/* the file input is always hidden => it keeps the chosen file */}
        <input
          ref={editImage}
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />

        <button
          type="button"
          onClick={function () {
            editImage.current?.click();
          }}
          disabled={isPending}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <ImagePlus size={18} />
          {photoButtonText}
        </button>

        <button
          type="button"
          onClick={saveEdit}
          disabled={isPending}
          className="ml-auto rounded-full bg-blue-600 px-4 py-1.5 text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {saveText}
        </button>
        <button
          type="button"
          onClick={closeEditor}
          disabled={isPending}
          className="text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}