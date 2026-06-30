import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Header, Footer, getActiveSection } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Taylor PTA - Silent Auction",
  description: "Silent Auction Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const activeSection = getActiveSection(pathname);

  return (
    <html lang="en">
      <body>
        <Header activeSection={activeSection} />
        <main className="o-container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
