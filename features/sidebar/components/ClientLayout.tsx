"use client"

import React, { useState } from "react"
import Footer from "../../footer/client/components/Footer";
import Sidebar from "./Sidebar";
import { Navbar } from "@/features/navbar/client/components/NavBar";

export default function ClientLayout({ children }: {
    children: React.ReactNode
}) {

    const [sidebar, setSidebar] = useState(false);

    const handleToggleMenu = (val: boolean) => setSidebar(val);

    return (
        <div>
            <div className="flex flex-col gap-10">
                <Navbar onMenuToggle={handleToggleMenu} />
                <Sidebar sidebar={sidebar} handleToggleMenu={handleToggleMenu} />
                <main>{children}</main>
                <Footer />
            </div>
        </div>
    )
}