"use client";

import {Toaster as Sonner} from "sonner";
import type {ToasterProps} from "sonner";
import {useAppContext} from "@/state/app-state";

const Toaster = ({...props}: ToasterProps) => {
  const {theme} = useAppContext();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export {Toaster};
