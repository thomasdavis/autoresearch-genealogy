import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Sagigi Family Wiki",
  description:
    "Encyclopedia of the Sagigi, Doolah, and Cowley families of the Torres Strait Islands",
};

export default function WikiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="wiki-body">
        {children}
      </body>
    </html>
  );
}
