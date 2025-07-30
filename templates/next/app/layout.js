import "./globals.css";

export const metadata = {
  title: "Next.js Starter",
  description: "A simple Next.js application by Create Launcher",
};

export default function RootLayout({ children }) {
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
