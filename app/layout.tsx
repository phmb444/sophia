import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SophIA",
  description: "An educational artificial intelligence",
  icons: { icon: ["/favicon_white.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ width: "100vw" }}>
        {children}
      </body>
    </html>
  );
}
