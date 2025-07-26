'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "./context/I18nContext";
import { AuthProvider } from "./context/AuthContext";
import CategoryProvider from "./context/CategoryContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const inter = Inter({ subsets: ["latin"] });

const paypalOptions = {
  clientId: "AdGUXBKzSaUCAZ_j7UO8YOYCbWRQCIcBl9o0pC6GJ7PQmT6uMucRdWCGegdB65JJbGewVP97-iU7EiAl",
  currency: "RUB",
  intent: "capture",
  disableFunding: "bancontact,blik,eps,giropay,ideal,mercadopago,mybank,p24,sepa,sofort,venmo",
  enableFunding: "card,credit,paypal",
  commit: true,
  vault: false,
  components: "buttons"
};

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
        <PayPalScriptProvider options={paypalOptions}>
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
