import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Script from "next/script";
// import Head from "next/head";

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
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.gaId!}`} strategy='afterInteractive' />
      <Script id='google-analytics' strategy='afterInteractive'>{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.gaId!}');
      `}</Script>
    </html>
  );
}
