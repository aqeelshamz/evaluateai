import "./globals.css";
import type { Metadata } from "next";
import { appName } from "@/utils/utils";
import { Golos_Text } from 'next/font/google'
import "react-toastify/dist/ReactToastify.css";

const golos = Golos_Text({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: appName,
  description: "AI powered exam sheet evaluation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={golos.className}>{children}</body>
    </html>
  );
}
