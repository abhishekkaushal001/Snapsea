"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoIosSend } from "react-icons/io";

interface Props {
  user: User;
  chatId: string;
}

const ChatInputPage = ({ user, chatId }: Props) => {
  const [isSending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) {
      return;
    }

    setSending(true);
    try {
      await axios.post("/api/message", { chatId, text: input });
      setInput("");
      inputRef.current?.focus();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex space-x-3">
      <input
        type="text"
        ref={inputRef}
        className="w-full px-5 pt-5 pb-10 border border-gray-300 focus:outline-indigo-600 rounded-lg"
        placeholder={`Message ${user.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        disabled={isSending}
        className="bg-neutral-900 disabled:bg-gray-400 hover:bg-neutral-950 text-white font-medium px-5 py-3 rounded-lg flex align-middle items-center space-x-2 min-w-fit h-fit"
        onClick={() => sendMessage()}
        type="submit"
      >
        <span className="text-sm md:text-lg">Send</span>
        {isSending ? (
          <Loader2 className="animate-spin h-4 w-4 md:h-6 md:w-6" />
        ) : (
          <IoIosSend className="h-5 w-5 md:h-8 md:w-8" />
        )}
      </button>
    </div>
  );
};

export default ChatInputPage;
