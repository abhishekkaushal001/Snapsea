import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized access denied." },
        { status: 400 }
      );
    }
    const { user } = session;

    const body = await req.json();
    const { text, chatId } = body;

    const [id1, id2] = chatId.split("--");
    if (user.id !== id1 && user.id !== id2) {
      return NextResponse.json(
        { message: "Unauthorized access denied." },
        { status: 400 }
      );
    }

    const friendId = user.id === id1 ? id2 : id1;
    const friendList = (await db.smembers(
      `user:${user.id}:friends`
    )) as string[];
    const isFriend = friendList.includes(friendId);

    if (!isFriend) {
      return NextResponse.json(
        { message: "Unauthorized access denied." },
        { status: 401 }
      );
    }

    const sender = await db.get(`user:${user.id}`);

    const timestamp = Date.now();

    const message = {
      id: timestamp.toString().concat(Math.random().toString()),
      senderId: user.id,
      text,
      timestamp,
    };

    await pusherServer.trigger(`chat__${chatId}`, "new_message", message);

    await db.zadd(`user:${chatId}:messages`, {
      score: timestamp,
      member: message,
    });

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
