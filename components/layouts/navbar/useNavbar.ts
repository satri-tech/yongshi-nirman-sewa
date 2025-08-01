"use client";

import { useEffect, useRef } from "react";
import { scrollToElement } from "@/lib/utils/scroll";
import { usePathname, useRouter } from "next/navigation"; // ✅ Correct for App Router

export const useNavbar = (onMenuToggle: (state: boolean) => void) => {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (id: string) => {
    if (pathname !== "/") {
      router.push("/");

      // Delay scroll to allow the page to load
      setTimeout(() => {
        scrollToElement(id);
      }, 500); // 500ms to 800ms usually works fine

      onMenuToggle(false);
      return;
    }

    if (id === "portfolio") {
      router.push("/portfolio");
      return;
    }

    scrollToElement(id);
    onMenuToggle(false);
  };

  const toInitial = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
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
