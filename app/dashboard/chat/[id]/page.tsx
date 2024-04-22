import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Message } from "@/lib/validation";
import axios from "axios";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import ChatInputPage from "./ChatInput";
import MessagesSection from "./Messages";

interface Props {
  params: { id: string };
}

async function getChatMessages(chatId: string) {
  const response = await axios.get(
    `${process.env.UPSTASH_REDIS_REST_URL}/zrange/user:${chatId}:messages/0/-1`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    }
  );
  const result: string[] = response.data.result;
  const results = result.map((res) => JSON.parse(res) as Message).reverse();

  return results;
}

const ChatPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }
  const { user } = session;

  const [id1, id2] = params.id.split("--");
  if (user.id !== id1 && user.id !== id2) {
    return notFound();
  }

  const partnerId = user.id === id1 ? id2 : id1;
  const partner = (await db.get(`user:${partnerId}`)) as User;

  const initialMessages = await getChatMessages(params.id);

  return (
    <div className="w-full">
      <div className="flex flex-col h-full max-h-[91vh] md:max-h-none">
        <div className="w-full flex justify-between border-b-2 border-gray-200 px-5">
          <div className="flex align-middle items-center justify-center gap-5 py-1.5 md:py-3">
            <div className="relative h-10 w-10 md:h-16 md:w-16">
              <Image
                alt={partner.name}
                src={partner.image}
                referrerPolicy="no-referrer"
                className="rounded-full"
                fill
              />
            </div>
            <div className="flex flex-col align-middle justify-center">
              <p className="text-lg md:text-2xl font-semibold text-slate-800">
                {partner.name}
              </p>
              <p className="text-xs md:text-sm font-medium text-gray-500">
                {partner.email}
              </p>
            </div>
          </div>
        </div>

        <MessagesSection
          initialMessages={initialMessages}
          sessionId={user.id}
          partner={partner}
          user={user as User}
          chatId={params.id}
        />

        <div className="w-full px-2 md:px-5 border-t border-gray-200 pb-3 pt-3 md:pb-9 md:pt-4">
          <ChatInputPage chatId={params.id} user={partner} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
