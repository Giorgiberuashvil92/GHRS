import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "GHRS - Georgian Health & Rehabilitation System",
    template: "%s | GHRS"
  },
  description: "Professional health and rehabilitation platform with comprehensive exercises, courses, and expert guidance.",
  keywords: ["health", "rehabilitation", "exercises", "therapy", "Georgia", "medical"],
  authors: [{ name: "GHRS Team" }],
  openGraph: {
    type: "website",
    locale: "ka_GE",
    alternateLocale: ["en_US", "ru_RU"],
    siteName: "GHRS",
    title: "GHRS - Georgian Health & Rehabilitation System",
    description: "Professional health and rehabilitation platform",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}