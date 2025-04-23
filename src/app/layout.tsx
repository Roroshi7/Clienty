import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import Navbar from "@/sections/Navbar";
// import { Footer } from "@/sections/Footer";
import { MyProvider } from "@/context/MyContext";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "CareerLink",
  description:
    "Empowering your career journey with AI-powered tools like career advising, roadmap generation, resume builder, and interview preparation.",
  openGraph: {
    title: "CareerLink",
    description:
      "Empowering your career journey with AI-powered tools like career advising, roadmap generation, resume builder, and interview preparation.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <MyProvider>
        <html lang="en">
          <body
            className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
          >
            <Navbar />
            {children}
          </body>
        </html>
      </MyProvider>
    </ClerkProvider>
  );
}
