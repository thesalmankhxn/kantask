'use client';

import { AppContextProvider } from "@/state/app-state";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <AppContextProvider>{children}</AppContextProvider>
    );
}