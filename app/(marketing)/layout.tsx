// app/layout.tsx
import ClientLayout from "@/components/layouts/client-layout/ClientLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Site",
    description: "Example site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (

        <>
            <ClientLayout>{children}</ClientLayout>
        </>

    );
}
