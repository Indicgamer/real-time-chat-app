import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "./EmojiPicker";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setIsEmojiPickerOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEmojiSelect = (emoji) => {
    const input = textInputRef.current;
    const cursorPosition = input.selectionStart;
    const textBefore = text.substring(0, cursorPosition);
    const textAfter = text.substring(cursorPosition);
    const newText = textBefore + emoji + textAfter;
    
    setText(newText);
    
    // Set cursor position after the emoji
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
    }, 0);
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          <input
            ref={textInputRef}
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn btn-circle ${
              isEmojiPickerOpen ? "text-primary" : "text-zinc-400"
            }`}
            onClick={toggleEmojiPicker}
          >
            <Smile size={20} />
          </button>

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          {/* Emoji Picker */}
          <EmojiPicker
            isOpen={isEmojiPickerOpen}
            onToggle={toggleEmojiPicker}
            onEmojiSelect={handleEmojiSelect}
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
