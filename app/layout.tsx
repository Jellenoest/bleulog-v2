import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Metadata } from "next";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "BlueLog",
  description: "Digitaal duiklogboek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="bg-slate-950 text-white">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}