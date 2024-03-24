import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import UsersSendRequest from "./UsersSendRequest";

const UserList = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }
  const { user } = session;

  const keys = (await db.smembers("user:list"))
    .filter((key) => key !== user.id)
    .map((key) => `user:${key}`);

  let users;
  if (keys.length !== 0) {
    users = (await db.mget(keys)) as User[];
  }

  return (
    <div className="mt-8 border border-gray-200 max-w-fit px-5 py-3 rounded-md min-w-min">
      <div className="text-2xl font-semibold text-slate-900 p-1 pb-2 border-b">
        Send request to users you want to chat
      </div>

      {users ? (
        <div className="my-3 pt-3 flex flex-col gap-3 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-center items-center align-middle max-w-fit py-3 px-4 space-x-2 border rounded-md hover:shadow-sm border-gray-200 hover:border-gray-400"
            >
              <div className="relative h-12 w-12 rounded-full">
                <Image
                  alt={user.name}
                  src={user.image}
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  fill
                />
              </div>
              <div className="flex justify-center align-middle text-xl font-medium px-4">
                <p>{user.name}</p>
              </div>
              <UsersSendRequest email={user.email} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 font-medium text-center pt-5 pb-4">
          No Users to show
        </p>
      )}
    </div>
  );
};

export default UserList;
