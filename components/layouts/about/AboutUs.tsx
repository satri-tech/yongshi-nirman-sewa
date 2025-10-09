'use client'
import HeaderTitle from "@/components/ui/HeaderTitle";
import { StatsSection } from "../stats";
import { data } from "./constants"
import {
    fadeInDown,
} from '@/hooks/use-scroll-animation';
import {
    AnimatedTitle,
    AnimatedDescription,
    AnimatedButton,
} from '@/components/animations/animated-component';
export default function AboutUs() {

    return (
        <div
            className="flex lg:flex-row flex-col justify-center items-center sm:mt-24 mt-10 h-max border-t-[0.1px]   font-Poppins sm:py-16 py-8 "
            id="about"
        >
            <div
                className="flex l:w-[92%] w-[90%]  sm:gap-10  gap-4 flex-col"
            >
                <AnimatedButton variants={fadeInDown}>
                    <HeaderTitle header={'About Us'} />
                </AnimatedButton>
                <div
                    className="w-full flex sm:flex-row flex-col  sm:gap-5  gap-4"
                >
                    <AnimatedTitle
                        variants={fadeInDown}
                        className=" sm:w-6/12 sm:text-[2.8rem] text-3xl sm:font-medium font-medium sm:leading-[4.4rem] leading-10 tracking-tight"
                    >
                        {data.title1} <br />
                        {data.title2}
                    </AnimatedTitle>
                    <div

                        className=" sm:w-6/12 flex flex-col  sm:gap-14 gap-6 "
                    >
                        <AnimatedDescription
                            className="text-[#212121] sm:text-lg text-base tracking-wide text-justify sm:leading-7 leading-7 sm:pt-4"
                        >
                            {data.description}
                        </AnimatedDescription>
                        <div
                        >
                            <StatsSection />
                            <div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </div>
    );
};

