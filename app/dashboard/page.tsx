import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  return <div>{JSON.stringify(session.user)}</div>;
};

export default DashboardPage;
