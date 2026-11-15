
import { useContext, useRef, useState } from "react";
import { Avatar } from "@heroui/react";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import { authContext } from "../../Context/AuthContext";
import useCreatePost from "../../Hooks/UseCreatePost";

const CreatePost = () => {
  const { userData } = useContext(authContext);

  const { mutate, isPending } = useCreatePost();

  const postBody = useRef<HTMLTextAreaElement>(null);
  const postImage = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImage() {
    const file = postImage.current?.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);

    if (postImage.current) {
      postImage.current.value = "";
    }
  }

  // after a successful send => empty the text and the image
  function clearForm() {
    if (postBody.current) {
      postBody.current.value = "";
    }
    removeImage();
  }

  function createPost() {
    const body = postBody.current?.value.trim() ?? "";
    const image = postImage.current?.files?.[0];

    // text or an image or both
    if (body === "" && !image) {
      toast.error("Write something or add an image");
      return;
    }

    const formData = new FormData();
    if (body !== "") {
      formData.append("body", body);
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

  return (
    <form
      onSubmit={function (e) {
        e.preventDefault(); // no page reload
        createPost();
      }}
      className="space-y-4 rounded-2xl bg-white p-5 shadow-md"
    >
      {/* avatar + the text area */}
      <div className="flex items-start gap-3">
        <Avatar size="md">
          <Avatar.Image src={userData?.photo} alt="Profile photo" />
          <Avatar.Fallback>{userData?.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
        </Avatar>

        <textarea
          ref={postBody}
          rows={3}
          placeholder="What's on your mind?"
          disabled={isPending}
          className="w-full resize-none rounded-2xl bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* the chosen image with an X on top */}
      {imagePreview && (
        <div className="relative inline-block">
          <img
            src={imagePreview}
            alt="Selected"
            className="max-h-72 rounded-xl object-cover"
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

      <div className="flex items-center border-t border-gray-100 pt-3">
        {/* the file input is always hidden => it keeps the chosen file */}
        <input
          ref={postImage}
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />

        {/* open the file window */}
        {imagePreview === null && (
          <button
            type="button"
            onClick={function () {
              postImage.current?.click();
            }}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            <ImagePlus size={20} />
            Photo
          </button>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="ml-auto rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
