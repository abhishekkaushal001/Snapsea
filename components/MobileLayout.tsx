"use client";

import { overviewOptions } from "@/app/dashboard/layout";
import { Dialog, Transition } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { GiBigWave } from "react-icons/gi";
import Button from "./ui/Button";
import FriendRequestsSideBar from "./ui/FriendRequestsSideBar";
import SideBarChatOptions from "./ui/SideBarChatOptions";
import SignOutButton from "./ui/SignOutButton";
import { usePathname } from "next/navigation";

interface Props {
  friendsId: User[];
  requests: number;
  user: any;
}

export default function MobileLayout({ friendsId, requests, user }: Props) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <div className="flex align-middle justify-between py-1 px-4 bg-gray-50 border-b border-indigo-300">
        <Link
          href="/dashboard"
          className="flex shrink-0 h-14 w-fit text-2xl font-semibold outline-none align-middle items-center text-slate-800 gap-x-2"
        >
          <GiBigWave className="h-7 w-auto text-indigo-600" />
          <span className="align-middle pt-1">Snapsea</span>
        </Link>

        <Button className="self-center" onClick={() => setOpen(true)}>
          <Menu className="" />
        </Button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10 md:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="-translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="-translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-hidden bg-white py-6 shadow-xl">
                      <div className="px-6 sm:px-6">
                        <Dialog.Title className="flex align-middle justify-between">
                          <Link
                            href="/dashboard"
                            className="flex shrink-0 h-16 w-fit text-3xl font-semibold outline-none align-middle items-center text-slate-800 gap-x-2"
                          >
                            <GiBigWave className="h-8 w-auto text-indigo-600" />
                            <span className="align-middle pt-1">Snapsea</span>
                          </Link>

                          <button
                            type="button"
                            className="rounded-md text-gray-300 p-1 w-fit h-fit self-center focus:outline-none focus:ring-2 focus:ring-gray-800"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </Dialog.Title>
                      </div>

                      <div className="relative flex-1 px-4 sm:px-6">
                        <div className="flex h-full w-full grow flex-col gap-y-3 overflow-y-auto overflow-x-hidden bg-white">
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
                                    <span className="truncate">
                                      {overview.name}
                                    </span>
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
                                <SideBarChatOptions
                                  friends={friendsId}
                                  userId={user.id}
                                />
                              </div>
                            </div>
                          ) : null}
                          <div className="-mx-6 mt-auto flex items-center w-full">
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
                                <span
                                  aria-hidden
                                  className="text-zinc-400 text-xs truncate"
                                >
                                  {user.email}
                                </span>
                              </div>
                            </div>
                            <SignOutButton />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
