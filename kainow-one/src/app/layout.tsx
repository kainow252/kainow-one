import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationsProvider } from "@/lib/notifications-context";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kainow One - O marketplace de todos",
  description: "Compre e venda produtos em todo o Brasil. Eletrônicos, moda, casa, esportes e muito mais com segurança e praticidade.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <NotificationsProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
