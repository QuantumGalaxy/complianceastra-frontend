import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth-context";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ComplianceAstra – PCI DSS Scope & SAQ Assessment Tool",
    template: "%s | ComplianceAstra",
  },
  description:
    "ComplianceAstra helps businesses quickly determine PCI DSS scope and identify the correct SAQ using a simple guided assessment.",
  keywords: [
    "PCI DSS scope tool",
    "PCI compliance assessment",
    "PCI SAQ determination",
    "PCI DSS questionnaire",
    "PCI DSS compliance tool",
  ],
  metadataBase: new URL("https://complianceastra.com"),
  openGraph: {
    title: "ComplianceAstra",
    description:
      "Simplify complex compliance frameworks and determine your PCI DSS scope in minutes.",
    url: "https://complianceastra.com",
    siteName: "ComplianceAstra",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {gaId && process.env.NODE_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-md"
            >
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
