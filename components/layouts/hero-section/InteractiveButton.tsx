// components/InteractiveButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { scrollToElement } from "@/lib/utils/scroll";
import { ArrowRight } from "lucide-react";

export default function InteractiveButton() {
    const handleScrollToAbout = () => {
        scrollToElement("about");
    };

    return (
        <Button
            onClick={handleScrollToAbout}
            className="relative overflow-hidden h-12 w-56 flex justify-center items-center bg-black text-white px-4 gap-2 rounded-md group"
        >
            {/* Sliding background */}
            <span className="absolute inset-0 bg-blue-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></span>

            {/* Button content */}
            <div className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-500">
                Schedule a call
                <ArrowRight size={17} />
            </div>
        </Button>
    );
}
