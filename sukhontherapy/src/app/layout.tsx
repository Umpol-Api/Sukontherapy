import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Sukhontherapy Massage & Spa | Premium Thai Wellness in Bangkok",
  description:
    "Experience authentic Thai massage and luxury spa treatments at Sukhontherapy, TIPCO Tower, Bangkok. Book your rejuvenating session online — Thai massage, aromatherapy, hot stone, couples retreat, and more.",
  keywords:
    "Thai massage Bangkok, spa TIPCO Tower, aromatherapy Bangkok, couples massage, reflexology, hot stone therapy, Phaya Thai spa",
  openGraph: {
    title: "Sukhontherapy Massage & Spa",
    description: "Relax. Restore. Rebalance. Premium Thai wellness in Bangkok.",
    type: "website",
    locale: "en_US",
    siteName: "Sukhontherapy",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SessionProvider>
          <Header />
          <main style={{ minHeight: "100vh" }}>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
