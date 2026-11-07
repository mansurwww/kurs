import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "EduPlatform - Оқу платформасы (FastAPI + Next.js)",
  description: "Мұғалімдер мен студенттерге арналған толық циклді білім беру жүйесі",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk">
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
          EduPlatform © 2026. FastAPI + Next.js 16 + Keycloak + Ollama.
        </footer>
      </body>
    </html>
  );
}

