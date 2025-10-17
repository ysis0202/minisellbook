import type { Metadata, Viewport } from "next";
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "머니셀즈",
  },
  icons: {
    icon: "/logo512.png",
    apple: "/logo192.png",
  },
};

// Next.js 15: viewport와 themeColor는 별도로 export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10b981",
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