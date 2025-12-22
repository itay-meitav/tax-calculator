import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.scss";
import Script from "next/script";
import { ThemeProvider } from "./contexts/ThemeContext";

const rubik = Rubik({ 
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d9488",
};

const SITE_URL = "https://tax-calculator-2026.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "מחשבון הפרשי מס 2023 - 2026 | נקודות זיכוי מילואים לוחם",
    template: "%s | מחשבון הפרשי מס",
  },
  description: "השוו את המס שלכם בין השנים 2023-2026 וגלו כמה תשלמו פחות. מחשבון הפרשי מס עם נקודות זיכוי למשרתי מילואים לוחמים לפי תיקון 283 לפקודת מס הכנסה.",
  keywords: ["מחשבון מס", "מס הכנסה", "מדרגות מס", "נקודות זיכוי", "חישוב מס 2026", "הפרשי מס", "מס ישראל", "מילואים לוחם", "זיכוי מילואים", "תיקון 283", "מחשבון מס הכנסה", "חישוב מס 2025"],
  authors: [{ name: "Itay Meitav", url: "https://www.linkedin.com/in/itay-meitav/" }],
  creator: "Itay Meitav",
  publisher: "Itay Meitav",
  alternates: {
    canonical: SITE_URL,
    languages: {
      'he-IL': SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: SITE_URL,
    siteName: "מחשבון הפרשי מס",
    title: "מחשבון הפרשי מס 2023 - 2026 | זיכוי מילואים לוחם",
    description: "השוו את המס שלכם בין השנים וגלו כמה תשלמו פחות. כולל נקודות זיכוי למשרתי מילואים לוחמים.",
    images: [
      {
        url: "/og-image.png",
        width: 1600,
        height: 838,
        alt: "מחשבון מס עם נקודות זיכוי למשרתי מילואים",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "מחשבון הפרשי מס 2023 - 2026 | זיכוי מילואים לוחם",
    description: "השוו את המס שלכם בין השנים וגלו כמה תשלמו פחות",
    images: [
      {
        url: "/og-image.png",
        width: 1600,
        height: 838,
        alt: "מחשבון מס עם נקודות זיכוי למשרתי מילואים",
      },
    ],
    creator: "@itaymeitav",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
  },
  category: 'finance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "מחשבון הפרשי מס 2023 - 2026",
              "alternateName": "מחשבון מס הכנסה ישראל",
              "description": "מחשבון לחישוב הפרשי מס הכנסה בין השנים 2023-2026 עם נקודות זיכוי למשרתי מילואים לוחמים לפי תיקון 283",
              "url": "https://tax-calculator-2026.vercel.app/",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Any",
              "browserRequirements": "Requires JavaScript",
              "inLanguage": "he-IL",
              "author": {
                "@type": "Person",
                "name": "Itay Meitav",
                "url": "https://www.linkedin.com/in/itay-meitav/"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "ILS"
              },
              "featureList": [
                "חישוב מס הכנסה לפי מדרגות מס 2023-2026",
                "נקודות זיכוי למשרתי מילואים לוחמים",
                "השוואה בין שנות מס",
                "חישוב חיסכון במס"
              ]
            }),
          }}
        />
      </head>
      <body className={rubik.className}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.gaId!}`} strategy='afterInteractive' />
      <Script id='google-analytics' strategy='afterInteractive'>{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.gaId!}');
      `}</Script>
      <Script 
        src="https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js" 
        strategy="lazyOnload"
      />
    </html>
  );
}
