import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/contexts/DataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Strata Facilities Booking System",
  description: "Manage and book your community facilities with ease",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Strata Facilities",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} touch-manipulation`}>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
