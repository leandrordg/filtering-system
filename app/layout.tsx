import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/components/providers";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Filtering System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={font.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
