import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import useUpdateComment from "../../Hooks/UseUpdateComment";
import type { IComment } from "../../interfaces/posts.interface";

// the edit form of a comment
// the text is always required, at least 2 characters
// the image can only be CHANGED, it can't be removed
export default function CommentEditor({
  comment,
  onDone,
}: {
  comment: IComment;
  onDone: () => void;
}) {
  const editInput = useRef<HTMLInputElement>(null);
  const editImage = useRef<HTMLInputElement>(null);

  const [newPreview, setNewPreview] = useState<string | null>(null);

  const { mutate, isPending } = useUpdateComment(comment.post, comment._id);

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

    //empty the file input 
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
    const content = editInput.current?.value.trim() ?? "";
    const newImage = editImage.current?.files?.[0];

    if (content.length < 2) {
      toast.error("The comment needs a text of at least 2 characters");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
  
    if (newImage) {
      formData.append("image", newImage);
    }

    mutate(formData, {
      onSuccess: function () {
        closeEditor();
      },
    });
  }

  // the new image if there is one otherwise the current image of the comment
  let shownImage = comment.image;
  if (newPreview) {
    shownImage = newPreview;
  }

  let photoButtonText = "Add image";
  if (shownImage) {
    photoButtonText = "Change image";
  }

  let saveText = "Save";
  if (isPending) {
    saveText = "Saving...";
  }

  return (
    <div className="space-y-2">
      <input
        ref={editInput}
        type="text"
        defaultValue={comment.content}
        placeholder="Write a comment..."
        autoFocus
        disabled={isPending}
        onKeyDown={function (e) {
          // Enter saves, Esc cancels
          if (e.key === "Enter") {
            saveEdit();
          }
          if (e.key === "Escape") {
            closeEditor();
          }
        }}
        className="w-full rounded-full bg-gray-100 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* just change img can't delete */}
      {shownImage && (
        <div className="relative inline-block">
          <img src={shownImage} alt="Comment" className="max-h-40 rounded-xl object-cover" />
          {newPreview && (
            <button
              type="button"
              aria-label="Cancel the new image"
              onClick={cancelNewImage}
              disabled={isPending}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 px-2 text-xs font-medium">
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
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
        >
          <ImagePlus size={14} />
          {photoButtonText}
        </button>

        <button
          type="button"
          onClick={saveEdit}
          disabled={isPending}
          className="text-blue-600 hover:underline disabled:opacity-60"
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