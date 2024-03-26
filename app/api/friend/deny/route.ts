import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
});
type Id = z.infer<typeof schema>;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized access." },
        { status: 400 }
      );
    }
    const { user } = session;

    const body: Id = await req.json();

    const validate = await schema.safeParseAsync(body);
    if (!validate.success) {
      return NextResponse.json(
        { message: "Invalid request." },
        { status: 422 }
      );
    }

    const isAlreadyFriends = await db.sismember(
      `user:${user.id}:friends`,
      body.id
    );
    if (isAlreadyFriends) {
      return NextResponse.json(
        { message: "Invalid request, User already in friends." },
        { status: 400 }
      );
    }

    const hasFriendRequest = await db.sismember(
      `user:${user.id}:incoming_friend_requests`,
      body.id
    );
    if (!hasFriendRequest) {
      return NextResponse.json(
        { message: "Invalid request, Request doesn't exists." },
        { status: 400 }
      );
    }

    await pusherServer.trigger(
      `user__${user.id}__incoming_friend_requests`,
      "request_deny",
      {}
    );

    await db.srem(`user:${user.id}:incoming_friend_requests`, body.id);

    return NextResponse.json({ message: "Friend request deleted." });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal error." }, { status: 500 });
  }
}
