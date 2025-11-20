import { useEffect, useState } from "react";
import { ISidebarProps } from "../types/types";
import { scrollToElement } from "@/features/shared/utils/scroll";
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
    const multiPageRoutes: { [key: string]: string } = {
      about: "/about",
      projects: "/projects",
      team: "/team",
      services: "/services",
      contact: "/contact",
    };

    if (multiPageRoutes[id]) {
      handleToggleMenu(false);
      router.push(multiPageRoutes[id]);
      return;
    }

    if (pathname !== "/") {
      handleToggleMenu(false);

      router.push("/"); // ✅ Use router.push instead of redirect()

      setTimeout(() => {
        scrollToElement(id);
      }, 500);

      return;
    }

    scrollToElement(id);
    handleToggleMenu(false);
  };

  return { menuList, navigateToLink };
};
