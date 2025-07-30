'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "./context/I18nContext";
import { AuthProvider } from "./context/AuthContext";
import CategoryProvider from "./context/CategoryContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const inter = Inter({ subsets: ["latin"] });

const paypalOptions = {
  clientId: "AQtqwl189MSBEbnUWNGIfPsAl3ynUUUKr506gJa5SDXhnXzje33FVtEJaTjcqRXE9FCnUPWu3kaVlfEO",
  currency: "RUB",
  intent: "capture",
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
