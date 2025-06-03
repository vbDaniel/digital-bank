// app/ClientProviders.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "src/contexts/AuthContext";
import { GlobalProvider } from "src/contexts/GlobalContext";

const queryClient = new QueryClient();

export default function ClientProviders({ children }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalProvider>{children}</GlobalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
