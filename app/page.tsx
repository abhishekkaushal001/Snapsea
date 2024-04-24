import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { GiBigWave } from "react-icons/gi";
import { IoMail } from "react-icons/io5";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <section className="w-screen h-screen max-h-screen max-w-[100vw] bg-black flex flex-col text-white">
      <nav className="w-full border-b border-stone-700 py-3">
        <div className="container mx-auto flex justify-between align-middle px-2">
          <Link href="/">
            <div className="flex align-middle space-x-2">
              <GiBigWave className="h-8 w-auto text-white" />
              <span className="text-white font-sans text-3xl font-medium">
                Snapsea
              </span>
            </div>
          </Link>

          <div className="flex self-center space-x-3">
            {!session ? (
              <Link
                href="/login"
                className="text-sm w-fit h-fit self-center font-medium text-slate-800 bg-white py-[6px] px-4 rounded-md hover:bg-transparent hover:ring-1 hover:ring-white hover:text-white transition-all duration-300 ease-in-out"
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  href="/dashboard/add"
                  className="text-xs md:text-sm w-fit h-fit self-center font-medium text-white/60 bg-transparent py-[6px] px-3 md:px-4 rounded-md hover:bg-transparent ring-1 ring-white/40 hover:text-white hover:ring-white/60 transition-all duration-300 ease-in-out"
                >
                  Chats
                </Link>
                <Link
                  href="/dashboard"
                  className="text-xs md:text-sm w-fit h-fit self-center font-medium text-slate-800 bg-white py-[6px] px-3 md:px-4 rounded-md hover:bg-transparent hover:ring-1 hover:ring-white/70 hover:text-white transition-all duration-300 ease-in-out"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 w-full h-full grid place-items-center">
        <div className="w-full px-2">
          <div className="flex flex-col align-middle md:text-center text-transparent bg-clip-text bg-gradient-to-bl md:bg-gradient-to-br from-cyan-500 via-pink-600 via-purple-600 to-amber-500">
            <h1 className="text-6xl md:text-8xl font-bold">Snapsea</h1>
            <h2 className="text-5xl md:text-6xl font-bold mt-3 md:mt-7">
              Where Conversations Meet the Horizon
            </h2>
          </div>

          <div className="mt-10 md:mt-7 flex flex-col items-center align-middle md:text-center w-full">
            <p className="border-[.5px] border-solid border-white/25 rounded-md md:py-2 p-1 md:px-4 w-fit text-transparent bg-clip-text bg-gradient-to-r from-white/20 via-white/40 via-white/80 via-white/40 to-white/20">
              Chat with realtime features & no downtime, Chats are end-to-end
              encrypted.
            </p>
          </div>

          <div className="mt-12 md:mt-12 flex space-x-8 md:space-x-16 items-center justify-center align-middle w-full text-white/40">
            <Link href="https://github.com/abhishekkaushal001" target="_blank">
              <FaGithub className="h-6 w-6 md:h-8 md:w-8 hover:text-white transition-all duration-300 ease-in-out" />
            </Link>
            <Link href="https://twitter.com/itsakshay001" target="_blank">
              <FaXTwitter className="h-6 w-6 md:h-8 md:w-8 hover:text-white transition-all duration-300 ease-in-out" />
            </Link>
            <Link href="mailto:abhishekkaushal121@gmail.com" target="_blank">
              <IoMail className="h-7 w-7 md:h-9 md:w-9 hover:text-white transition-all duration-300 ease-in-out" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/abhishekkaushal001/"
              target="_blank"
            >
              <FaLinkedinIn className="h-6 w-6 md:h-8 md:w-8 hover:text-white transition-all duration-300 ease-in-out" />
            </Link>
          </div>
        </div>
      </div>

      <footer className="w-full text-sm md:text-base flex justify-center align-middle py-1 px-2 font-light text-stone-500">
        2024 © Abhishek Kaushal
      </footer>
    </section>
  );
}
