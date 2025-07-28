"use client";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import CategoryProvider from "../context/CategoryContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  return (
    <CategoryProvider value={{ categories: [], loading: false, error: null, refetch: async () => {} }}>
      {children}
      {!hideFooter && <Footer />}
    </CategoryProvider>
  );
}
