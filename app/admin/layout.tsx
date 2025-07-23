"use client";
import { useSession } from "next-auth/react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Building, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

interface IDummyData {
    name: string;
    email: string;
    id: string;
}
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const headerData = {
        team: {
            name: "Client Name",
            logo: Building,
            plan: "Admin Panel",
        },
    };

    const navMainData = {
        items: [
            {
                title: "Users",
                url: "/admin",
                icon: User,
            },
            {
                title: "Settings",
                url: "/admin/settings",
                icon: Settings,
            },
        ],
    };
    const dummyData: IDummyData = {
        // Changed from array to single object
        name: "",
        email: "",
        id: "",
    };

    // Transform session?.user into IUserData format
    const userData = session?.user
        ? {
            name: session.user.name || "",
            email: session.user.email || "",
            id: session.user.id || "",
        }
        : dummyData;

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider className={outfit.className}>
                <AppSidebar
                    headerData={headerData}
                    userData={userData}
                    navMainData={navMainData}
                />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" variant="secondary" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <Link href="/admin">Home</Link>
                                    </BreadcrumbItem>
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink className="dark:text-white text-black">
                                                {pathname === "/admin"
                                                    ? "dashboard"
                                                    : pathname.split("/")[2]}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
