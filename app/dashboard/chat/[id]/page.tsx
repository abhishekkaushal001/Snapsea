import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Message } from "@/lib/validation";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import ChatInputPage from "./ChatInput";
import MessagesSection from "./Messages";

interface Props {
  params: { id: string };
}

async function getChatMessages(chatId: string) {
  const results: string[] = await db.zrange(`user:${chatId}:messages`, 0, -1);
  const dbMessages = results.map((res) => JSON.parse(res) as Message).reverse();
  return dbMessages;
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
      <div className="flex flex-col h-full">
        <div className="w-full flex justify-between border-b-2 border-gray-200">
          <div className="flex align-middle items-center justify-center gap-5 py-3">
            <div className="relative h-16 w-16">
              <Image
                alt={partner.name}
                src={partner.image}
                referrerPolicy="no-referrer"
                className="rounded-full"
                fill
              />
            </div>
            <div className="flex flex-col align-middle justify-center">
              <p className="text-2xl font-semibold text-slate-800">
                {partner.name}
              </p>
              <p className="text-sm font-medium text-gray-500">
                {partner.email}
              </p>
            </div>
          </div>
        </div>

        <MessagesSection
          initialMessages={initialMessages}
          sessionId={user.id}
        />

        <div className="w-full px-5 border-t border-gray-200 pb-9 pt-4">
          <ChatInputPage chatId={params.id} user={partner} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
