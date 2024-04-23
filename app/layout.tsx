import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SnapSea",
  description:
    "Where Conversations Meet the Horizon, Chat with realtime features & no downtime, Chats are end-to-end encrypted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="h-screen max-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
