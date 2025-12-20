"use client";

import "./globals.css";
import { I18nProvider } from "./context/I18nContext";
import { AuthProvider } from "./context/AuthContext";
import CategoryContext from "./context/CategoryContext";
import { ModalProvider } from "./context/ModalContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AQtqwl189MSBEbnUWNGIfPsAl3ynUUUKr506gJa5SDXhnXzje33FVtEJaTjcqRXE9FCnUPWu3kaVlfEO0',
  currency: "USD",
  intent: "capture",
  components: "buttons",
  "disable-funding": "credit,card",
  "data-sdk-integration-source": "button-factory",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PayPalScriptProvider options={paypalOptions}>
          <I18nProvider>
            <AuthProvider>
              <ModalProvider>
                <CategoryContext.Provider value={{ categories: [], loading: false, error: null, refetch: async () => {} }}>
                  {children}
                </CategoryContext.Provider>
              </ModalProvider>
            </AuthProvider>
          </I18nProvider>
        </PayPalScriptProvider>
      </body>
    </html>
  );
}