"use client";

import { pusherClient } from "@/lib/pusher";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";

interface Props {
  requestCount: number;
  sessionId: string;
}

const FriendRequestsSideBar = ({ requestCount, sessionId }: Props) => {
  const [requests, setRequests] = useState<number>(requestCount);

  useEffect(() => {
    pusherClient.subscribe(`user__${sessionId}__incoming_friend_requests`);
    const friendRequestHnadler = () => {
      setRequests((prev) => prev + 1);
    };
    const requestActionHandler = () => {
      setRequests((prev) => prev - 1);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHnadler);
    pusherClient.bind("request_deny", requestActionHandler);
    pusherClient.bind("request_accept", requestActionHandler);

    return () => {
      pusherClient.unsubscribe(`user__${sessionId}__incoming_friend_requests`);
      pusherClient.unbind("incoming_friend_requests", friendRequestHnadler);
      pusherClient.unbind("request_deny", requestActionHandler);
      pusherClient.unbind("request_accept", requestActionHandler);
    };
  }, [sessionId]);

  return (
    <>
      <Link
        href="/dashboard/requests"
        className="flex gap-3 p-2 text-sm leading-6 font-semibold align-middle items-center text-gray-600 hover:text-indigo-600 group hover:bg-gray-50"
        onClick={() => setRequests(0)}
      >
        <span className="border text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 p-1 rounded-lg items-center justify-center text-xs font-medium bg-white">
          <FiUser className="h-4 w-4" />
        </span>
        <span className="truncate">Friend requests</span>

        {requests > 0 && (
          <div className="flex items-center justify-center text-xs rounded-full h-5 w-5 text-white bg-indigo-600">
            {requests}
          </div>
        )}
      </Link>
    </>
  );
};

export default FriendRequestsSideBar;
