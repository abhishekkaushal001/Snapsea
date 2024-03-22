"use client";

import { useState } from "react";
import { User } from "./page";
import Image from "next/image";

interface Props {
  incomingRequests: User[];
  sessionId: string;
}

const FriendRequests = ({ incomingRequests, sessionId }: Props) => {
  const [requests, setRequests] = useState<User[]>(incomingRequests);

  if (requests.length === 0) {
    return (
      <div className="w-full">
        <p className="text-lg text-zinc-400">No friend requests to show.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-4 min-w-fit">
      {requests.map((req) => (
        <div
          className="flex items-center min-w-fit justify-center space-x-7 hover:shadow-sm p-5 border border-gray-100 rounded-md hover:border-gray-200"
          key={req.id}
        >
          <div className="relative h-[50px] w-[50px] items-center justify-center">
            <Image
              alt={req.name}
              src={req.image}
              referrerPolicy="no-referrer"
              fill={true}
              className="rounded-md h-[50px] max-w-min my-auto"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-medium text-gray-900 ">
              {req.name}
            </span>
            <span className="text-sm text-gray-400">{req.email}</span>
          </div>

          <div className="flex items-center justify-center h-full w-full space-x-2">
            <button
              aria-label="accepet request"
              className="bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white p-2 rounded-md"
            >
              Confirm
            </button>
            <button
              aria-label="deny request"
              className="bg-red-500 hover:bg-red-600  flex items-center justify-center text-white p-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default FriendRequests;
