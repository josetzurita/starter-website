import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LabShell } from "../components/lab-shell";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "CDS Lab",
  description: "Internal component and interaction catalogue for creative developers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <LabShell>{children}</LabShell>
        </Providers>
      </body>
    </html>
  );
}
