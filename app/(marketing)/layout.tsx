// app/layout.tsx
import ClientLayout from "@/features/sidebar/components/ClientLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Yongshi Nirman Sewa",
    description: "Construction Company",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (

        <>
            <ClientLayout>{children}</ClientLayout>
        </>

    );
}
