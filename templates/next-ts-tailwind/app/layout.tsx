import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js + TypeScript + Tailwind Starter",
  description: "A simple Next.js + TypeScript + Tailwind application by Create Launcher"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./icon.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
