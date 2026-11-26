import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import BottomNavigation from "@/components/modals/bottomNavigation/BottomNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkyRoute",
  description: "SkyRoute Frontend Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNavigation />
      </body>
    </html>
  );
}
