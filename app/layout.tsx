import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/lib/session-provider";
import { Toaster } from "sonner";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Yongshi Nirman Sewa",
  description: "Construction Company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className}  antialiased`}
      >
        <SessionProviderWrapper>
          <Toaster />
          yo yo
          {children}
        </SessionProviderWrapper>
      </body>
    </html >
  );
}
