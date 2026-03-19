import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { ReactLenis } from "lenis/react";

const satoshi = localFont({
  src: [
    // Regular
    {
      path: "../fonts/satoshi/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-Italic.woff2",
      weight: "400",
      style: "italic",
    },

    // Light
    {
      path: "../fonts/satoshi/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },

    // Medium
    {
      path: "../fonts/satoshi/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },

    // Bold
    {
      path: "../fonts/satoshi/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },

    // Black
    {
      path: "../fonts/satoshi/Satoshi-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const mangoGrotesque = localFont({
  src: [
    {
      path: "../fonts/mango/MangoGrotesque-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/mango/MangoGrotesque-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/mango/MangoGrotesque-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/mango/MangoGrotesque-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/mango/MangoGrotesque-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/mango/MangoGrotesque-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-mango",
  display: "swap",
});

const nightDemo = localFont({
  src: [{ path: "../fonts/Nightydemo.otf" }],
  variable: "--font-nighty",
  display: "swap",
});

const branch = localFont({
  src: [{ path: "../fonts/Branch.otf" }],
  variable: "--font-nighty",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bioconstructores Asociados SAS ",
  description:
    "Bioconstructores Asociados SAS",
  icons: {
    icon: [
      { url: "/images/bcas-logo.png" },
      { url: "/images/bcas-logo.png", type: "image/png" },
      { url: "/images/bcas-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/bcas-logo.png", sizes: "192x192", type: "image/png" },
      { url: "/images/bcas-logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/images/bcas-logo.png", // icono para dispositivos Apple
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactLenis root options={{ lerp: 0.08 }}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${satoshi.variable} ${mangoGrotesque.variable} ${nightDemo.variable} ${branch.variable} antialiased`}
        >
          {children}
        </body>
      </ReactLenis>
    </html>
  );
}
