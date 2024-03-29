"use client";

import { pusherClient } from "@/lib/pusher";
import { Message } from "@/lib/validation";
import { useEffect } from "react";

interface Props {
  userId: string;
}

export interface Data extends Message, User {
  chatId: string;
}

const NotificationsProvider = ({ userId }: Props) => {
  useEffect(() => {
    pusherClient.subscribe(`user__${userId}__chats`);

    const messageHandler = (data: Data) => {
      console.log(data);
    };

    pusherClient.bind("new_message_notification", messageHandler);

    return () => {
      pusherClient.unsubscribe(`user__${userId}__chats`);
      pusherClient.unbind("new_message_notification", messageHandler);
    };
  }, []);
  return <></>;
};

export default NotificationsProvider;
