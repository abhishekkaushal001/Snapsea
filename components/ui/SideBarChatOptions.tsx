"use client";

import { pusherClient } from "@/lib/pusher";
import { Message } from "@/lib/validation";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Data } from "./NotificationsProvider";
import CustomToast from "./CustomToast";

interface Props {
  friends: User[];
  userId: string;
}

const SideBarChatOptions = ({ friends, userId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  useEffect(() => {
    pusherClient.subscribe(`user__${userId}__chats`);

    const messageHandler = (data: Data) => {
      if (pathname.includes(data.chatId)) return;

      toast.custom((t) => (
        <CustomToast
          t={t}
          chatId={data.chatId}
          userImg={data.image}
          userName={data.name}
          userMsg={data.text}
        />
      ));

      setUnseenMessages((prev) => [...prev, data]);
    };

    pusherClient.bind("new_message_notification", messageHandler);

    return () => {
      pusherClient.unsubscribe(`user__${userId}__chats`);
      pusherClient.unbind("new_message_notification", messageHandler);
    };
  }, [pathname, router, userId]);

  useEffect(() => {
    if (pathname.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  const getChatId = (id1: string, id2: string) => {
    return id1 < id2 ? `${id1}--${id2}` : `${id2}--${id1}`;
  };

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto space-y-1">
      {friends.sort().map((fid) => {
        const unseenMessagesCount = unseenMessages.filter(
          (msg) => msg.senderId === fid.id
        ).length;

        return (
          <Link
            href={`/dashboard/chat/${getChatId(userId, fid.id)}`}
            key={fid.id}
            onClick={() => router.refresh()}
          >
            <li className="flex border-b border-gray-300 py-4 px-3 group align-middle gap-3 hover:bg-gray-50 rounded-md transition-all ease-in-out">
              <div className="relative h-8 w-8">
                <Image
                  alt={fid.name}
                  src={fid.image}
                  referrerPolicy="no-referrer"
                  className="rounded-lg"
                  fill
                />
              </div>
              <div className="font-medium text-lg align-middle my-auto text-gray-700 group-hover:text-indigo-600 transition-all ease-in-out">
                {fid.name}
              </div>
              {unseenMessagesCount > 0 && (
                <div className="flex items-center justify-center align-middle text-white text-xs h-5 w-5 my-auto mx-auto bg-indigo-600 rounded-full">
                  {unseenMessagesCount}
                </div>
              )}
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default SideBarChatOptions;
