import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAHARA",
  description:
    "Nepal's healthcare and emergency coordination platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}