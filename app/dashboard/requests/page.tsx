import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import FriendRequests from "./FriendRequests";

export interface User {
  email: string;
  id: string;
  image: string;
  name: string;
}

const RequestsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }
  const {
    user: { id, email },
  } = session;

  const requests = (
    await db.smembers(`user:${id}:incoming_friend_requests`)
  ).map((req) => `user:${req}`);

  let reqUsers;
  if (requests.length !== 0) {
    reqUsers = (await db.mget(requests)) as User[];
  }

  return (
    <main className="p-10">
      <h1 className="text-5xl text-gray-900 font-bold mb-8">Friend requests</h1>

      <div className="flex flex-col gap-4">
        <FriendRequests incomingRequests={reqUsers!} sessionId={id} />
      </div>
    </main>
  );
};

export default RequestsPage;
