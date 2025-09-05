// components/layouts/navbar/Navbar/Navbar.tsx
"use client";

import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { useNavbar } from "./useNavbar";
import { NavbarProps } from "./types";
import { NAV_LINKS } from "./constants";
import { Button } from "@/components/ui/button";
import { AnimatedArrow } from "@/components/animations/animated-component";
import { ArrowRight } from "lucide-react";

export const Navbar = ({ onMenuToggle }: NavbarProps) => {
    const { handleMenuClick, toInitial } = useNavbar(onMenuToggle);

    return (
        <nav className="py-6 flex w-full justify-center font-Poppins sticky top-0 bg-white z-50 border-b">
            <div className="w-[92%] flex justify-between">
                <div
                    className="font-semibold text-2xl cursor-pointer font-Varela"
                    onClick={toInitial}
                >
                    Yongshi Construction
                </div>

                <div className="hidden lg:flex gap-12 text-sm font-medium">
                    {NAV_LINKS.map((data) => (
                        <button
                            key={data.id}
                            className="cursor-pointer hover:text-primary"
                            onClick={() => handleMenuClick(data.id)}
                        >
                            {data.title}
                        </button>
                    ))}
                    <button
                        className="text-2xl cursor-pointer z-50"
                        onClick={() => onMenuToggle(true)}
                    >
                        <HiOutlineMenuAlt4 />
                    </button>
                    {/* <Button className="h-10 w-32 text-sm flex justify-center items-center bg-black text-white rounded-full cursor-pointer px-1 gap-2 hover:scale-105 transition-transform duration-500" >
                        <div>Book Us</div>
                        <AnimatedArrow className="text-2xl">
                            <ArrowRight size={17} />
                        </AnimatedArrow>
                    </Button> */}
                </div>

                <button
                    className="text-2xl cursor-pointer z-50 lg:hidden"
                    onClick={() => onMenuToggle(true)}
                >
                    <HiOutlineMenuAlt4 />
                </button>
            </div>
        </nav>
    );
};