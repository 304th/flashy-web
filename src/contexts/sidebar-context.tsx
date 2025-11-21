"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SidebarContextType {
  expanded: boolean;
  toggleSidebar: () => void;
  setExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SIDEBAR_STORAGE_KEY = "sidebar-expanded";

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load initial state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) {
      setExpanded(stored === "true");
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever expanded changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(expanded));
    }
  }, [expanded, mounted]);

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ expanded, toggleSidebar, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
