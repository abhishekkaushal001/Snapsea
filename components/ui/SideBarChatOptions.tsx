"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  friends: User[];
  userId: string;
}

const SideBarChatOptions = ({ friends, userId }: Props) => {
  const getChatId = (id1: string, id2: string) => {
    return id1 < id2 ? `${id1}--${id2}` : `${id2}--${id1}`;
  };

  return (
    <ul className="max-h-[25rem] overflow-y-auto space-y-1">
      {friends.sort().map((fid) => (
        <Link
          href={`/dashboard/chat/${getChatId(userId, fid.id)}`}
          key={fid.id}
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
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default SideBarChatOptions;
