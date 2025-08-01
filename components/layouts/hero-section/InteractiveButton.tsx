// components/InteractiveButton.tsx
"use client";

import { AnimatedArrow } from "@/components/animations/animated-component";
import { Button } from "@/components/ui/button";
import { scrollToElement } from "@/lib/utils/scroll";
import { ArrowRight } from "lucide-react";

export default function InteractiveButton() {
    const handleScrollToAbout = () => {
        scrollToElement("about")
    }

    return (
        <Button onClick={handleScrollToAbout} className="h-12 w-44 text-sm flex justify-center items-center bg-black text-white rounded-full cursor-pointer px-1 gap-2 hover:scale-105 transition-transform duration-500" >
            <div>Learn More</div>
            <AnimatedArrow className="text-2xl">
                <ArrowRight size={17} />
            </AnimatedArrow>
        </Button>
    );
}
