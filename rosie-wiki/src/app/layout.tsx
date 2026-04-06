import type { Metadata } from "next";
import "./globals.css";
import WikiHeader from "@/components/WikiHeader";
import WikiSidebar from "@/components/WikiSidebar";

export const metadata: Metadata = {
  title: "Rosiepedia - EKY Native Title Rosie Encyclopedia",
  description:
    "Wikipedia-style articles for every woman named Rosie in the Eastern Kuku Yalanji native title determination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <WikiHeader />
        <div className="flex flex-1">
          <WikiSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
