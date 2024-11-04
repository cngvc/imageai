import TopNav from "@/components/header/top-nav";
import { ImageProvider } from "@/context/image";
import PaypalProvider from "@/context/paypal";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ImageAI - AI Image Generator",
  description:
    "Generate images with AI for free, Buy credits to generate more images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ImageProvider>
            <PaypalProvider>
              <TopNav />
              {children}
            </PaypalProvider>
          </ImageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
