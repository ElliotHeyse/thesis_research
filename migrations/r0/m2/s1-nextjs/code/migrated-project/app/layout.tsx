import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Taylor PTA - Silent Auction",
    default: "Home | Taylor PTA - Silent Auction",
  },
  description: "Taylor Elementary School PTA Silent Auction Management",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="o-container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
