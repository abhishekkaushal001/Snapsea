"use client";

import { useEffect, useState } from "react";
import { User } from "./page";
import Image from "next/image";
import axios from "axios";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";

interface Props {
  incomingRequests: User[];
  sessionId: string;
}

const FriendRequests = ({ incomingRequests, sessionId }: Props) => {
  const [requests, setRequests] = useState<User[]>(incomingRequests);
  const [isProcessing, setProcessing] = useState(false);
  const [isdenying, setdeny] = useState(false);
  const router = useRouter();

  useEffect(() => {
    pusherClient.subscribe(`user__${sessionId}__incoming_friend_requests`);

    const friendRequestHandler = (request: User) => {
      if (requests && requests.length > 0) {
        setRequests((prev) => [...prev, request]);
      } else {
        setRequests([request]);
      }
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(`user__${sessionId}__incoming_friend_requests`);
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [requests, sessionId]);

  if (!requests || requests.length === 0) {
    return (
      <div className="w-full mt-8 ">
        <p className="text-lg text-zinc-400">No friend requests to show.</p>
      </div>
    );
  }

  const confirmRequest = async (id: string) => {
    setProcessing(true);
    try {
      await axios.post("/api/friend/accept", { id });
      setRequests(requests.filter((req) => req.id !== id));
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setProcessing(false);
    }
  };

  const denyRequest = async (id: string) => {
    setdeny(true);
    try {
      await axios.post("/api/friend/deny", { id });
      setRequests(requests.filter((req) => req.id !== id));
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setdeny(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4 min-w-fit">
      {requests.map((req) => (
        <div
          className="flex items-center min-w-fit justify-center space-x-7 hover:shadow-sm p-5 border border-gray-200 rounded-md hover:border-gray-400 transition-all ease-in-out"
          key={req.id}
        >
          <div className="relative h-[50px] w-[50px] items-center justify-center">
            <Image
              alt={req.name}
              src={req.image}
              referrerPolicy="no-referrer"
              className="rounded-md h-[50px] max-w-min my-auto"
              height={100}
              width={100}
              objectPosition="relative"
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
              className="bg-indigo-600 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-200 flex items-center justify-center text-white p-2 rounded-md"
              onClick={() => confirmRequest(req.id)}
              disabled={isProcessing}
            >
              {isProcessing && (
                <Loader2 className="animate-spin h-4 w-4 mr-1" />
              )}
              <span>Confirm</span>
            </button>
            <button
              aria-label="deny request"
              className="bg-red-500 hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-200 flex items-center justify-center text-white p-2 rounded-md"
              onClick={() => denyRequest(req.id)}
              disabled={isdenying}
            >
              {isdenying && <Loader2 className="animate-spin h-4 w-4 mr-1" />}
              <span>Delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default FriendRequests;
