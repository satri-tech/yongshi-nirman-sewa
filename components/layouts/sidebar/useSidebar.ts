import { useEffect, useState } from "react";
import { ISidebarProps } from "./types";
import { scrollToElement } from "@/lib/utils/scroll";

export const useSidebar = ({ sidebar, handleToggleMenu }: ISidebarProps) => {
  const [menuList, setMenuList] = useState(false);
  useEffect(() => {
    if (sidebar) {
      setTimeout(() => {
        setMenuList(true);
      }, 500);
    } else {
      setMenuList(false);
    }
  }, [sidebar]);
  const navigateToLink = (id: string) => {
    if (id === "home") {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      handleToggleMenu(false);
    }

    scrollToElement(id);
    handleToggleMenu(false);
  };
  return { menuList, navigateToLink };
};
