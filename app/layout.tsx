import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "מחשבון הפרשי מס 2023 - 2024",
  description: "השתמשו במחשבון הפרשי המס לשנים 2023-2024 לחישוב מס מדויק ועדכני. אידיאלי לחישוב מס הכנסה, הבנת מדרגות המס החדשות וניצול של נקודות זיכוי ממס הכנסה."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-2P71P12K1Y" />
    </html>
  );
}
