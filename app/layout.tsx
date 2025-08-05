'use client';

import "./globals.css";
import { I18nProvider } from "./context/I18nContext";
import { AuthProvider } from "./context/AuthContext";
import CategoryProvider from "./context/CategoryContext";
import { ModalProvider } from "./context/ModalContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

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
      <body>
        <PayPalScriptProvider options={paypalOptions}>
          <I18nProvider>
            <AuthProvider>
              <ModalProvider>
                <CategoryProvider value={{ categories: [], loading: false, error: null, refetch: async () => {} }}>
                  {children}
                </CategoryProvider>
              </ModalProvider>
            </AuthProvider>
          </I18nProvider>
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
