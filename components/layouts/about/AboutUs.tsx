'use client'
import HeaderTitle from "@/components/ui/HeaderTitle";
import { StatsSection } from "../stats";
import { data } from "./constants"
import { motion } from 'framer-motion';
import {
    useScrollAnimation,
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    staggerContainer,
    staggerItem
} from '@/hooks/use-scroll-animation';
import {
    AnimatedTitle,
    AnimatedDescription,
    AnimatedButton,
    AnimatedArrow,
    AnimatedImageContainer
} from '@/components/animations/animated-component';
export default function AboutUs() {

    return (
        <div
            className="flex lg:flex-row flex-col justify-center items-center mt-24 h-max border-t-[0.1px]  font-Poppins py-16 "
            id="about"
        >
            <div
                className="flex l:w-[92%] w-[90%]  sm:gap-10  gap-4 flex-col"
            >
                <AnimatedButton variants={staggerItem}>
                    <HeaderTitle header={'About Us'} />
                </AnimatedButton>
                <div
                    className="w-full flex sm:flex-row flex-col  sm:gap-5  gap-6"
                >
                    <AnimatedTitle
                        variants={fadeInLeft}
                        className=" sm:w-6/12 sm:text-[2.8rem] text-3xl font-medium sm:leading-[4.4rem] tracking-tight"
                    >
                        {data.title1} <br />
                        {data.title2}
                    </AnimatedTitle>
                    <div

                        className=" sm:w-6/12 flex flex-col  sm:gap-14 gap-6 "
                    >
                        <AnimatedDescription
                            className="text-[#212121] text-lg tracking-wide text-justify leading-6 sm:pt-4"
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

