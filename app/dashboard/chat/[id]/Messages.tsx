"use client";

import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/validation";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Props {
  initialMessages: Message[];
  sessionId: string;
  user: User;
  partner: User;
  chatId: string;
}

const MessagesSection = ({
  initialMessages,
  sessionId,
  user,
  partner,
  chatId,
}: Props) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pusherClient.subscribe(`chat__${chatId}`);
    const newMessageHandler = (msg: Message) => {
      setMessages((prev) => [msg, ...prev]);
    };
    pusherClient.bind("new_message", newMessageHandler);

    return () => {
      pusherClient.unsubscribe(`chat__${chatId}`);
      pusherClient.unbind("new_message", newMessageHandler);
    };
  }, [chatId]);

  const formatTimeStamp = (time: number) => {
    return format(time, "HH:mm");
  };

  return (
    <div
      id="messages"
      className="h-full flex flex-1 flex-col-reverse gap-2 md:gap-4 p-3 overflow-y-auto scrollbar"
    >
      <div ref={scrollRef} />

      {messages.map((msg, index) => {
        const isCurrentUser = msg.senderId === sessionId;
        const hasNextMessage =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div className="chat-message" key={msg.id}>
            <div
              className={cn("flex items-end", { "justify-end": isCurrentUser })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-sm md:text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn(
                    "px-3 py-1 md:px-4 md:py-2 rounded-lg inline-block",
                    {
                      "bg-indigo-600 text-white": isCurrentUser,
                      "bg-gray-200 text-gray-900": !isCurrentUser,
                      "rounded-br-none": !hasNextMessage && isCurrentUser,
                      "rounded-bl-none": !hasNextMessage && !isCurrentUser,
                    }
                  )}
                >
                  {msg.text}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatTimeStamp(msg.timestamp)}
                  </span>
                </span>
              </div>

              <div
                className={cn("relative w-7 h-7", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessage,
                })}
              >
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  alt={isCurrentUser ? user.name : partner.name}
                  src={isCurrentUser ? user.image : partner.image}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesSection;
