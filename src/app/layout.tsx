import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TitleBar from "@/components/TitleBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Teamspace",
  description: "A collaborative team workspace",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TitleBar />
        {children}
      </body>
    </html>
  );
}
