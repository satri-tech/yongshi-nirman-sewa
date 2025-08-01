"use client";
import EachProjectCard from "./EachProjectCard";
import HeaderTitle from "@/components/ui/HeaderTitle";
import { usePortfolio } from "./usePortfolio";
import { AnimatedArrow, AnimatedButton } from "@/components/animations/animated-component";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { fadeInDown, fadeInLeft } from "@/hooks/use-scroll-animation";

interface PortfolioComponentProps {
    showExploreMoreButton?: boolean;
    showTopBorder?: boolean;
}

const PortfolioComponent = ({
    showExploreMoreButton = true,
    showTopBorder = true,
}: PortfolioComponentProps) => {
    const { projectsdata } = usePortfolio();

    return (
        <div
            id="portfolio"
            className={`flex lg:flex-row flex-col justify-center items-center w-full  h-max font-Poppins  ${showTopBorder ? "border-t-[0.1px] mt-24 sm:pt-16 pt-8" : " mt-4 sm:pt-4"
                }`}
        >
            <div className="font-Poppins flex flex-col lg:w-[92%] w-[90%]">
                <div className="flex w-full sm:gap-6 gap-4 flex-col">
                    <AnimatedButton variants={fadeInDown}>
                        <HeaderTitle header={"Portfolio"} />
                    </AnimatedButton>

                    <AnimatedButton variants={fadeInLeft}>
                        <div className="w-full flex">
                            <div className="w-full sm:text-5xl text-3xl font-medium leading-[4.4rem] tracking-tight">
                                {`Let's dive into our Journey!`}
                            </div>
                        </div>
                    </AnimatedButton>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-x-8 sm:gap-y-16 gap-y-12 justify-items-center">
                        {projectsdata.map((data) => (
                            <EachProjectCard key={data.id} project={data} />
                        ))}
                    </div>

                    {showExploreMoreButton && (
                        <Link
                            href={"/portfolio"}
                            className="h-12 ml-auto w-44 text-sm flex justify-center items-center bg-black text-white rounded-full cursor-pointer px-1 gap-2 hover:scale-105 transition-transform duration-500"
                        >
                            <div>Explore More</div>
                            <AnimatedArrow className="text-2xl">
                                <ArrowRight size={17} />
                            </AnimatedArrow>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PortfolioComponent;
