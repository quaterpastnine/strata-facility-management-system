import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { WorkflowToastNotifier } from "@/components/workflow/WorkflowToastNotifier";
import { WorkflowExecutionToasts } from "@/components/workflow/WorkflowExecutionToasts";
import { DataLoader } from "@/components/shared/DataLoader";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Strata Facilities Booking System",
  description: "Manage and book your community facilities with ease",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Strata Facilities",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} touch-manipulation`}>
        <ErrorBoundary>
          <DataLoader />
          {children}
          <WorkflowToastNotifier />
          <WorkflowExecutionToasts />
          <Toaster position="top-right" />
        </ErrorBoundary>
      </body>
    </html>
  );
}
