import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { emailSchema } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type em = z.infer<typeof emailSchema>;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Invalid request, Not authorized." },
      { status: 400 }
    );
  }

  const body: em = await req.json();

  const validate = await emailSchema.safeParseAsync(body);
  if (!validate.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const user = session.user;

  const userId = await db.get(`user:email:${body.email}`);

  if (!userId) {
    return NextResponse.json(
      { message: "User doesn't exists." },
      { status: 400 }
    );
  }

  if (userId === user.id) {
    return NextResponse.json(
      {
        message:
          "Please enter a different email, you can't add yourself as a friend.",
      },
      { status: 400 }
    );
  }

  const isAlreadyAdded = (await db.sismember(
    `user:${userId}:incoming_friend_requests`,
    user.id
  )) as 0 | 1;

  if (isAlreadyAdded) {
    return NextResponse.json(
      { message: "Friend request already sent." },
      { status: 400 }
    );
  }

  const isAlreadyFriends = (await db.sismember(
    `user:${user.id}:friends`,
    userId
  )) as 0 | 1;

  if (isAlreadyFriends) {
    return NextResponse.json(
      { message: "User already added as friends." },
      { status: 400 }
    );
  }

  await db.sadd(`user:${userId}:incoming_friend_requests`, user.id);

  return NextResponse.json({ message: "Friend request sent successfully." });
}
