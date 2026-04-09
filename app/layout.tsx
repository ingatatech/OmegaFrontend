import { Inter } from "next/font/google";
import "./globals.css";

import LayoutShell from "@/components/LayoutShell";
import WhatsAppChat from "@/components/WhatsAppChat";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "OMEGA SIR Ltd",
  description: "Professional multi-service company website",
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
            <WhatsAppChat />
      </body>
    </html>
  );
}
