import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "#1 Social Media Marketplace | DoubleTBoosting",
  description: "Accelerate your social media growth with DoubleTBoosting. Quickly gain real followers, viewers, likes & more with our advanced blend of marketing tactics.",
};

import { AuthProvider } from "@/context/auth-context";

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${manrope.variable} font-manrope antialiased transition-colors duration-300 bg-white dark:bg-black text-black dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
