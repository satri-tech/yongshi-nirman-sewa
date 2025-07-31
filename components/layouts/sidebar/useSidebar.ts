import { useEffect, useState } from "react";
import { ISidebarProps } from "./types";
import { scrollToElement } from "@/lib/utils/scroll";
import { usePathname, useRouter } from "next/navigation";

export const useSidebar = ({ sidebar, handleToggleMenu }: ISidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
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
    if (pathname !== "/") {
      handleToggleMenu(false);

      router.push("/"); // ✅ Use router.push instead of redirect()

      setTimeout(() => {
        scrollToElement(id);
      }, 500);

      return;
    }

    if (id === "portfolio") {
      handleToggleMenu(false);
      router.push("/portfolio");
      return;
    }

    scrollToElement(id);
    handleToggleMenu(false);
  };

  return { menuList, navigateToLink };
};
