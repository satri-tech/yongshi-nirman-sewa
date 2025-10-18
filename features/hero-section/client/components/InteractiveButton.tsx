// components/InteractiveButton.tsx
"use client";

import { AnimatedArrow } from "@/features/animations/components/animated-component";
import { Button } from "@/features/shared/components/button";
import { scrollToElement } from "@/features/shared/utils/scroll";
import { ArrowRight } from "lucide-react";

export default function InteractiveButton() {
    const handleScrollToAbout = () => {
        scrollToElement("about");
    };

    return (

        <Button
            onClick={handleScrollToAbout}
            className="h-12  w-44 text-sm flex justify-center items-center bg-primary text-primary-foreground rounded-full cursor-pointer px-1 gap-2 hover:scale-105 transition-transform duration-500 hover:bg-primary/90"
        >
            <div>Explore More</div>
            <AnimatedArrow className="text-2xl">
                <ArrowRight size={17} />
            </AnimatedArrow>
        </Button>
    );
}
