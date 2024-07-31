import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import { Providers } from "./providers";

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
    <html lang="pt-br">
      <body className={`${inter.className} light overflow-x-hidden`} style={{ width: "100vw" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
