'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "./context/I18nContext";
import { AuthProvider } from "./context/AuthContext";
import CategoryProvider from "./context/CategoryContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Permissions-Policy"
          content="geolocation=(), camera=(), microphone=()"
        />
      </head>
      <body className={inter.className}>
        <PayPalScriptProvider options={{
          clientId: "AauAG9HWxx25fS0hccd_kZS5vQNfPA5hlQKolkRDLa1rDRklWnN3NasH0DWsMaM1pud7fwly032dGBDV",
          currency: "RUB",
          intent: "capture"
        }}>
          <I18nProvider>
            <AuthProvider>
              <CategoryProvider value={{ categories: [], setCategories: () => {} }}>
                {children}
              </CategoryProvider>
            </AuthProvider>
          </I18nProvider>
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
