"use client";

import { I18nProvider } from "./context/I18nContext";
import { AuthProvider } from "./context/AuthContext";
import CategoryContext from "./context/CategoryContext";
import { ModalProvider } from "./context/ModalContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// ✅ FIXED: Only initialize PayPal if client ID is provided
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const paypalOptions = paypalClientId ? {
  clientId: paypalClientId,
  currency: "USD",
  intent: "capture",
  components: "buttons",
  "disable-funding": "credit,card",
  "data-sdk-integration-source": "button-factory",
} : {
  clientId: "test", // Dummy value to prevent errors
  currency: "USD",
  intent: "capture",
  components: "buttons",
  "disable-funding": "credit,card",
  "data-sdk-integration-source": "button-factory",
};

export default function Providers({ children }: { children: React.ReactNode }) {
  // ✅ Conditionally render PayPalScriptProvider only if client ID exists
  const content = (
    <I18nProvider>
      <AuthProvider>
        <ModalProvider>
          <CategoryContext.Provider 
            value={{ 
              categories: [], 
              loading: false, 
              error: null, 
              refetch: async () => {} 
            }}
          >
            {children}
          </CategoryContext.Provider>
        </ModalProvider>
      </AuthProvider>
    </I18nProvider>
  );

  // Only wrap with PayPal if client ID is configured
  if (!paypalClientId) {
    console.warn("⚠️ PayPal Client ID not configured. PayPal payments will not work.");
    return content;
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      {content}
    </PayPalScriptProvider>
  );
}
