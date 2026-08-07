import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cierre contable mensual",
  description: "Seguimiento del cierre contable mensual por entidad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
