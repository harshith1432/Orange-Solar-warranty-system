import type { Metadata } from "next";
import "./globals.css";
import NotificationToast from "@/components/NotificationToast";

export const metadata: Metadata = {
  title: "E-Warranty Generation System | Secure. Fast. Paperless.",
  description: "Generate and manage your product e-warranty in a few simple steps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 min-h-screen text-slate-900 flex flex-col">
        <main className="flex-1">{children}</main>
        <NotificationToast />
      </body>
    </html>
  );
}
