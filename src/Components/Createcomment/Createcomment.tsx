import { useContext, useRef, useState } from "react";
import { Avatar } from "@heroui/react";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { authContext } from "../../Context/AuthContext";
import useCreateComment from "../../Hooks/UseCreateComment";

const CreateComment = ({ postId }: { postId: string }) => {
  const { userData } = useContext(authContext);

  const { mutate, isPending } = useCreateComment(postId);

  const commentContent = useRef<HTMLInputElement>(null);
  const commentImage = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImage() {
    const file = commentImage.current?.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); 
    }
    setImagePreview(null);

    if (commentImage.current) {
      commentImage.current.value = "";
    }
  }

  // after successful send=> empty the text and the image
  function clearForm() {
    if (commentContent.current) {
      commentContent.current.value = "";
    }
    removeImage();
  }

  function createComment() {
    const content = commentContent.current?.value.trim() ?? "";
    const image = commentImage.current?.files?.[0];

    // text or image or both
    if (content === "" && !image) {
      toast.error("Write a comment or add an image");
      return;
    }

    // at least 2 characters when the comment has a text =>API
    if (content !== "" && content.length < 2) {
      toast.error("The comment text needs at least 2 characters");
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
      },
    });
  }

  //icon turns into a spinner while sending
  let sendIcon = <Send size={20} />;
  if (isPending) {
    sendIcon = <Loader2 size={20} className="animate-spin" />;
  }

  return (
    <form
      onSubmit={function (e) {
        e.preventDefault(); // no page reload
        createComment();
      }}
      className="flex items-start gap-3"
    >
      <Avatar size="sm">
        <Avatar.Image src={userData?.photo} alt="Profile photo" />
        <Avatar.Fallback>{userData?.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
      </Avatar>

      <div className="min-w-0 flex-1">
       
        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
          <input
            ref={commentContent}
            type="text"
            placeholder="Write a comment..."
            disabled={isPending}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />

          <input
            ref={commentImage}
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />

          {imagePreview === null && (
            <button
              type="button"
              aria-label="Add an image"
              onClick={function () {
                commentImage.current?.click();
              }}
              className="text-gray-500 hover:text-blue-600"
            >
              <ImagePlus size={20} />
            </button>
          )}

          <button
            type="submit"
            aria-label="Create comment"
            disabled={isPending}
            className="text-gray-500 hover:text-blue-600 disabled:opacity-60"
          >
            {sendIcon}
          </button>
        </div> 
        
        {imagePreview && (
          <div className="relative mt-3 inline-block">
            <img
              src={imagePreview}
              alt="Selected"
              className="max-h-40 rounded-xl object-cover"
            />
            <button
              type="button"
              aria-label="Remove the image"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default CreateComment;