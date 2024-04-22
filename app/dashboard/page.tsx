import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const getFriendsByUserId = async () => {
    const id = (await db.smembers(`user:${session.user.id}:friends`)).map(
      (id) => `user:${id}`
    );
    const friends = id.length > 0 ? await db.mget(id) : [];
    return friends;
  };

  const getChatId = (id1: string, id2: string) => {
    return id1 < id2 ? `${id1}--${id2}` : `${id2}--${id1}`;
  };

  const friends = (await getFriendsByUserId()) as User[];
  const lastMessages = await Promise.all(
    friends.map(async (friend) => {
      const chatId = getChatId(session.user.id, friend.id);
      const [lastmessage] = (await db.zrange(
        `user:${chatId}:messages`,
        -1,
        -1
      )) as Message[];

      return {
        ...friend,
        lastmessage,
        chatId,
      };
    })
  );

  return (
    <main className="w-full p-5 md:px-16 md:py-10">
      <h1 className="text-3xl md:text-5xl text-gray-900 font-bold mb-8">
        Recent Chats
      </h1>

      <div className="flex flex-col align-middle space-y-2 border border-gray-200 rounded-lg p-2">
        {lastMessages.map((message) => (
          <Link key={message.id} href={`/dashboard/chat/${message.chatId}`}>
            <div className="flex flex-col align-middle w-full p-2 md:p-3 border border-gray-200 rounded-lg bg-gray-50 hover:border-gray-400 hover:shadow-lg transition-all duration-300 ease-in-out">
              <div className="flex align-middle justify-between">
                <div className="flex align-top space-x-2">
                  <Image
                    alt={message.name}
                    src={message.image}
                    style={{ position: "static" }}
                    className="h-8 w-8 rounded-full"
                    referrerPolicy="no-referrer"
                    width={1000}
                    height={1000}
                  />
                  <h4 className="text-lg align-top text-gray-900">
                    {message.name}
                  </h4>
                </div>
                <ChevronRight className="w-7 h-7 text-gray-800 self-center" />
              </div>

              <div className="flex align-top text-sm text-indigo-600 pl-9 md:pl-10 truncate">
                <span className="text-indigo-600 mr-1">
                  {message.lastmessage.senderId === message.id ? (
                    <span>&rarr;</span>
                  ) : (
                    "You:"
                  )}
                </span>
                {message.lastmessage.text}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default DashboardPage;
