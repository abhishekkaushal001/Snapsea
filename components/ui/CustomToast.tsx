import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import toast, { type Toast } from "react-hot-toast";

interface Props {
  t: Toast;
  chatId: string;
  userImg: string;
  userName: string;
  userMsg: string;
}

const CustomToast = ({ t, chatId, userImg, userName, userMsg }: Props) => {
  return (
    <div
      className={cn(
        "max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5",
        {
          "animate-enter": t.visible,
          "animate-leave": !t.visible,
        }
      )}
    >
      <a
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/chat/${chatId}`}
        className="flex-1 w-0 p-4"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="relative h-10 w-10">
              <Image
                alt="User Logo"
                src={userImg}
                referrerPolicy="no-referrer"
                fill
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex-1 ml-3">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="mt-1 text-sm text-gray-500">{userMsg}</p>
          </div>
        </div>
      </a>

      <div className="flex border border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex justify-center align-middle w-full h-full place-items-center p-4 text-indigo-500 font-semibold"
        >
          close
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
