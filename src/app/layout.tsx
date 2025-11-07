import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"], // required
  variable: "--font-poppins", // optional but good for CSS variables
  weight: ["400", "600", "700", "800", "900"], // choose based on your design needs
  display: "swap", // improves performance
});

export const metadata: Metadata = {
  title: "Calculator App",
  description: "Top Best calculators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
