import { inter, jetbrainsMono } from "./fonts";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/providers/SessionProviderWrapper";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastContainer } from "@/components/ui/Toast";
import { StoreInitializer } from "@/components/providers/StoreInitializer";

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://dayflow.app"),
  title: {
    default: "DayFlow — Daily Routine & Life Tracker",
    template: "%s | DayFlow",
  },
  description:
    "Plan your day, track your habits, log your study sessions, monitor water and diet — all in one clean personal dashboard. Built for people who want to build better daily routines.",
  keywords: [
    "daily routine tracker",
    "habit tracker",
    "study log",
    "timetable planner",
    "water tracker",
    "personal productivity",
    "daily planner",
    "life tracker",
  ],
  authors:  [{ name: "DayFlow" }],
  creator:  "DayFlow",
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true,
                 "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "DayFlow",
    title: "DayFlow — Daily Routine & Life Tracker",
    description:
      "Plan your day, track habits, log study sessions and monitor your health — one clean dashboard.",
    images: [{
      url: "/og-image.png",
      width: 1200, height: 630,
      alt: "DayFlow — Daily Routine Tracker",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DayFlow — Daily Routine & Life Tracker",
    description: "Plan your day, track habits, log study sessions.",
    images: ["/og-image.png"],
  },
  icons: {
    icon:    [{ url: "/logo.png", type: "image/png" },
              { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple:   [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/logo.png",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "DayFlow",
              "description":
                "Personal daily routine tracker and life dashboard",
              "url": process.env.NEXTAUTH_URL,
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <SessionProviderWrapper>
          <QueryProvider>
            <StoreInitializer />
            {children}
            <ToastContainer />
          </QueryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
