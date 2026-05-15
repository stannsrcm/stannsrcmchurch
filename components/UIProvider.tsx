"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const VirtualTour = dynamic(() => import("./VirtualTour"), { ssr: false });

interface UIContextType {
  openTour: () => void;
  closeTour: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [showTour, setShowTour] = useState(false);

  const openTour = () => setShowTour(true);
  const closeTour = () => setShowTour(false);

  return (
    <UIContext.Provider value={{ openTour, closeTour }}>
      {children}
      <AnimatePresence>
        {showTour && <VirtualTour onClose={closeTour} />}
      </AnimatePresence>
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
}
