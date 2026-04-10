import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "../../components/Sidebar";

export const metadata: Metadata = {
  title: "Davis Family Genealogy",
  description:
    "Genealogy research project for the Davis family of Mossman, North Queensland",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
