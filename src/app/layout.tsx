import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AISupportChat from "@/components/AISupportChat";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodingCanvas — Where Logic Meets Play",
  description: "The premium Python coding platform for kids. Transform from block-builders to real-world programmers through tactile play and professional mentorship.",
  openGraph: {
    title: "CodingCanvas — Where Logic Meets Play",
    description: "Premium Python coding platform for kids. Transform from block-builders to real-world programmers.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodingCanvas — Where Logic Meets Play",
    description: "Premium Python coding platform for kids.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cc-surface text-foreground">
        <Navigation />
        <main className="flex-1 flex flex-col">{children}</main>
        <AISupportChat />
      </body>
    </html>
  );
}
