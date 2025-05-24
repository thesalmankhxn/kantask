'use client';

import { AppContextProvider } from "@/state/app-state";
import { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <AppContextProvider>{children}</AppContextProvider>
    );
}