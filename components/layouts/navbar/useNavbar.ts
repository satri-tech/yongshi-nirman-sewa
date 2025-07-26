// components/layouts/navbar/Navbar/useNavbar.ts
"use client";

import { useEffect, useRef } from "react";
import { scrollToElement } from "@/lib/utils/scroll";

export const useNavbar = (onMenuToggle: (state: boolean) => void) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (id: string) => {
    scrollToElement(id);
    onMenuToggle(false);
  };

  const toInitial = () => {
    window.scrollTo({ behavior: "smooth", top: 0 });
    window.history.replaceState(null, "", window.location.pathname);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onMenuToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onMenuToggle]);

  return { menuRef, handleMenuClick, toInitial };
};
