"use client";

import axios, { AxiosError } from "axios";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa6";

const UsersSendRequest = ({ email }: { email: string }) => {
  const [isSending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const SendRequest = async () => {
    try {
      setSending(true);
      await axios.post("/api/friend/add", { email });
      setSent(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <button
        disabled={isSending || sent}
        className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md disabled:bg-gray-400"
        onClick={() => SendRequest()}
      >
        {isSending && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isSending && !sent && (
          <span className="text-white font-medium text-base flex gap-3 align-middle justify-center items-center">
            <FaUserPlus className="h-5 w-5" />{" "}
          </span>
        )}
        {sent && <Check className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default UsersSendRequest;
