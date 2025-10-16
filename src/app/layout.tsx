import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { NotificationScheduler } from "@/components/notification-scheduler";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MoneyCells - 머니셀즈",
  description: "당신의 돈을 셀 단위로 관리하는 스마트 가계부",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "머니셀즈",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
        <NotificationScheduler />
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              marginTop: '12px',
            },
            className: 'text-sm',
            duration: 3000,
          }}
          closeButton
        />
      </body>
    </html>
  );
}