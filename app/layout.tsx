import { Inter } from "next/font/google";
import "./globals.css";

import LayoutShell from "@/components/LayoutShell";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "OMEGA SIR Ltd | Professional Multi-Service Company",
    template: "%s | OMEGA SIR Ltd"
  },
  description: "OMEGA SIR Ltd is a professional multi-service company offering top-tier solutions in building maintenance, interior design, production workshops, and more in Rwanda.",
  keywords: ["OMEGA SIR Ltd", "Multi-service company Rwanda", "Building maintenance", "Interior design", "Construction Rwanda", "Production workshop"],
  authors: [{ name: "OMEGA SIR Ltd" }],
  creator: "OMEGA SIR Ltd",
  publisher: "OMEGA SIR Ltd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "OMEGA SIR Ltd | Professional Multi-Service Company",
    description: "Excellence in building maintenance, interior design, and multi-service solutions.",
    url: "https://omegasir.com", // Replace with your actual domain
    siteName: "OMEGA SIR Ltd",
    images: [
      {
        url: "/logo/1.jpeg",
        width: 1200,
        height: 630,
        alt: "OMEGA SIR Ltd Logo",
      },
    ],
    locale: "en_RW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OMEGA SIR Ltd | Professional Multi-Service Company",
    description: "Excellence in building maintenance, interior design, and multi-service solutions.",
    images: ["/logo/1.jpeg"], // Replace with your actual domain and image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				<link rel="apple-touch-icon" type="image/png" href="/favicon.png" />
				<link rel="icon" type="image/png" href="/favicon.png" />
			</head>
      <body className={`${inter.variable} antialiased`}>
        	<Toaster position="top-right" />
        		<LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
