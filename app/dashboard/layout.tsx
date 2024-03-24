import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";
import { GiBigWave } from "react-icons/gi";
import { FiUserPlus } from "react-icons/fi";
import Image from "next/image";
import SignOutButton from "@/components/ui/SignOutButton";
import FriendRequestsSideBar from "@/components/ui/FriendRequestsSideBar";
import { db } from "@/lib/db";
import SideBarChatOptions from "@/components/ui/SideBarChatOptions";

interface OverviewOptions {
  id: number;
  name: string;
  href: string;
  icon: ReactNode;
}

const overviewOptions: OverviewOptions[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    icon: <FiUserPlus className="h-4 w-4" />,
  },
];

const Layout = async ({ children }: PropsWithChildren) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }
  const user = session.user;

  const getFriendsByUserId = async () => {
    const id = (await db.smembers(`user:${user.id}:friends`)).map(
      (id) => `user:${id}`
    );
    const friends = await db.mget(id);
    return friends;
  };

  const requests = (
    await db.smembers(`user:${user.id}:incoming_friend_requests`)
  ).length;

  const friendsId = (await getFriendsByUserId()) as User[];

  return (
    <div className="w-full flex h-screen">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-3 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link
          href="/dashboard"
          className="flex shrink-0 h-16 text-3xl font-semibold align-middle items-center text-slate-800 gap-x-2"
        >
          <GiBigWave className="h-8 w-auto text-indigo-600" />
          <span className="align-middle pt-1">Snapsea</span>
        </Link>

        <div className="text-xs font-semibold leading-6 text-gray-400 mt-12">
          Overview
        </div>

        <div className="mt-2">
          <ul className="-mx-2 space-y-1">
            {overviewOptions.map((overview) => (
              <li key={overview.id} className="">
                <Link
                  href={overview.href}
                  className="flex gap-3 p-2 text-sm leading-6 font-semibold align-middle items-center text-gray-600 hover:text-indigo-600 group hover:bg-gray-50"
                >
                  <span className="border text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 p-1 rounded-lg items-center justify-center text-xs font-medium bg-white">
                    {overview.icon}
                  </span>
                  <span className="truncate">{overview.name}</span>
                </Link>
              </li>
            ))}

            <li>
              <FriendRequestsSideBar
                requestCount={requests}
                sessionId={user.id}
              />
            </li>
          </ul>
        </div>
        {friendsId.length > 0 ? (
          <div className="mt-5 flex flex-col flex-1 mb-5">
            <div className="text-xs font-semibold text-gray-400 leading-6">
              Your Chats
            </div>

            <div className="flex flex-1 flex-col mt-5 gap-y-7">
              <SideBarChatOptions friends={friendsId} userId={user.id} />
            </div>
          </div>
        ) : null}
        <div className="-mx-6 mt-auto flex items-center">
          <div className="flex flex-1 items-center gap-x-4 px-6 py-4 text-sm font-semibold leading-6 text-gray-900">
            <div className="relative h-10 w-10 bg-gray-50">
              <Image
                fill
                referrerPolicy="no-referrer"
                alt="Profile Image"
                className="rounded-full"
                src={user.image || ""}
              />
            </div>
            <div className="flex flex-col max-w-32">
              <span aria-hidden>{user.name}</span>
              <span aria-hidden className="text-zinc-400 text-xs truncate">
                {user.email}
              </span>
            </div>
          </div>
          <SignOutButton />
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
