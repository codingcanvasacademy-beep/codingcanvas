import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AISupportChat from "@/components/AISupportChat";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodingCanvas — Learn Python, Build Real Projects",
  description: "CodingCanvas is a premier Python learning platform for kids, featuring visual block coding, live teacher sessions, and real-time code execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cc-surface text-foreground">
        <Navigation />
        <main className="flex-1 flex flex-col">{children}</main>
        <AISupportChat />
      </body>
    </html>
  );
}
