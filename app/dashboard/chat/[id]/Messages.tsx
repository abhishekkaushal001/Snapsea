"use client";

import { Message } from "@/lib/validation";
import React, { useRef, useState } from "react";

interface Props {
  initialMessages: Message[];
  sessionId: string;
}

const MessagesSection = ({ initialMessages }: Props) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      id="messages"
      className="h-full flex flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto"
    >
      <div ref={scrollRef} />
      MessagesSection
    </div>
  );
};

export default MessagesSection;
