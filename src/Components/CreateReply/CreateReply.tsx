import { useContext, useRef, useState } from "react";
import { Avatar } from "@heroui/react";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { authContext } from "../../Context/AuthContext";
import useCreateReply from "../../Hooks/useCreateReply";

// onCreated => called after a reply was really added =>the comment uses it to open the replies list
const CreateReply = ({
  postId,
  commentId,
  onCreated,
}: {
  postId: string;
  commentId: string;
  onCreated?: () => void;
}) => {
  const { userData } = useContext(authContext);

  const { mutate, isPending } = useCreateReply(postId, commentId);

  const replyContent = useRef<HTMLInputElement>(null);
  const replyImage = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImage() {
    const file = replyImage.current?.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);

    if (replyImage.current) {
      replyImage.current.value = "";
    }
  }

  function clearForm() {
    if (replyContent.current) {
      replyContent.current.value = "";
    }
    removeImage();
  }

  function createReply() {
    const content = replyContent.current?.value.trim() ?? "";
    const image = replyImage.current?.files?.[0];

    // text or an image or both
    if (content === "" && !image) {
      toast.error("Write a reply or add an image");
      return;
    }

    // same the comment rule
    if (content !== "" && content.length < 2) {
      toast.error("The reply text needs at least 2 characters");
      return;
    }

    const formData = new FormData();
    if (content !== "") {
      formData.append("content", content);
    }
    if (image) {
      formData.append("image", image);
    }

    mutate(formData, {
      onSuccess: function () {
        clearForm();
        if (onCreated) {
          onCreated();
        }
      },
    });
  }

  let sendIcon = <Send size={18} />;
  if (isPending) {
    sendIcon = <Loader2 size={18} className="animate-spin" />;
  }

  return (
    <form
      onSubmit={function (e) {
        e.preventDefault(); // no page reload
        createReply();
      }}
      className="flex items-start gap-2"
    >
      <Avatar size="sm">
        <Avatar.Image src={userData?.photo} alt="Profile photo" />
        <Avatar.Fallback>{userData?.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
          <input
            ref={replyContent}
            type="text"
            placeholder="Write a reply..."
            disabled={isPending}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />

          {/*the file input is always hidden => it keeps the chosen file */}
          <input
            ref={replyImage}
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />

          {/*open the file window */}
          {imagePreview === null && (
            <button
              type="button"
              aria-label="Add an image"
              onClick={function () {
                replyImage.current?.click();
              }}
              className="text-gray-500 hover:text-blue-600"
            >
              <ImagePlus size={18} />
            </button>
          )}

          <button
            type="submit"
            aria-label="Create reply"
            disabled={isPending}
            className="text-gray-500 hover:text-blue-600 disabled:opacity-60"
          >
            {sendIcon}
          </button>
        </div>

        {/* the chosen image with an X on top */}
        {imagePreview && (
          <div className="relative mt-3 inline-block">
            <img
              src={imagePreview}
              alt="Selected"
              className="max-h-32 rounded-xl object-cover"
            />
            <button
              type="button"
              aria-label="Remove the image"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default CreateReply;