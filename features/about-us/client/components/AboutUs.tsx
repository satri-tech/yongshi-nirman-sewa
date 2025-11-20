'use client'
import HeaderTitle from "@/features/shared/components/HeaderTitle";
import {
    fadeInDown,
} from '@/features/shared/hooks/use-scroll-animation';
import {
    AnimatedTitle,
    AnimatedDescription,
    AnimatedButton,
} from '@/features/animations/components/animated-component';
import { IAboutUs } from "@/app/actions/about";
import { motion } from 'framer-motion';
import {
    useScrollAnimation,
    staggerContainer,
    staggerItem
} from '@/features/shared/hooks/use-scroll-animation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/features/shared/components/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface IAboutUsProps {
    aboutUsData: IAboutUs | null
    showTopBorder?: boolean;
}

export default function AboutUs({ aboutUsData, showTopBorder = true }: IAboutUsProps) {
    const statsAnimation = useScrollAnimation(0.2, true);
    const pathname = usePathname()

    return (
        <div
            className={`flex lg:flex-row flex-col justify-center items-center w-full h-max font-Poppins ${showTopBorder ? "border-t border-border sm:mt-24 mt-10 sm:pt-16 pt-8" : "mt-0 sm:pt-2 mb-20"}`}
            id="about"
        >
            <div className="flex lg:w-[92%] w-[90%] sm:gap-10 gap-4 flex-col">
                {pathname === "/about" ?
                    <Breadcrumb className="mr-auto font-medium ">
                        <BreadcrumbList>
                            <BreadcrumbItem className="dark:text-white text-neutral-800 hover:underline">
                                <Link href="/">Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink>About Us</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    :
                    <AnimatedButton variants={fadeInDown}>
                        <HeaderTitle header={'About Us'} />
                    </AnimatedButton>
                }

                {/* Main Content Section */}
                <div className="w-full flex sm:flex-row flex-col sm:gap-5 gap-4">
                    <AnimatedTitle
                        variants={fadeInDown}
                        className="sm:w-6/12 sm:text-[2.8rem] text-3xl sm:font-medium font-medium sm:leading-[4.4rem] leading-10 tracking-tight"
                    >
                        {aboutUsData?.mainHeading}
                    </AnimatedTitle>
                    <div className="sm:w-6/12 flex flex-col sm:gap-14 gap-6">
                        <AnimatedDescription
                            className="text-[#212121] dark:text-gray-300 sm:text-lg text-base tracking-wide text-justify sm:leading-7 leading-7 sm:pt-4"
                        >
                            {aboutUsData?.description}
                        </AnimatedDescription>

                        {/* Stats Section */}
                        <div>
                            <motion.div
                                ref={statsAnimation.ref}
                                variants={staggerContainer}
                                initial="hidden"
                                animate={statsAnimation.controls}
                                className="flex justify-between gap-16 font-Poppins"
                            >
                                <motion.div variants={staggerItem} className="flex flex-col sm:gap-4">
                                    <motion.div className="sm:text-5xl text-3xl font-medium">
                                        {aboutUsData?.stat1Number}
                                    </motion.div>
                                    <motion.div className="text-[#656565] dark:text-gray-400 sm:text-base text-xs">
                                        {aboutUsData?.stat1Label}
                                    </motion.div>
                                </motion.div>
                                <motion.div variants={staggerItem} className="flex flex-col sm:gap-4">
                                    <motion.div className="sm:text-5xl text-3xl font-medium">
                                        {aboutUsData?.stat2Number}
                                    </motion.div>
                                    <motion.div className="text-[#656565] dark:text-gray-400 sm:text-base text-xs">
                                        {aboutUsData?.stat2Label}
                                    </motion.div>
                                </motion.div>
                                <motion.div variants={staggerItem} className="flex flex-col sm:gap-4">
                                    <motion.div className="sm:text-5xl text-3xl font-medium">
                                        {aboutUsData?.stat3Number}
                                    </motion.div>
                                    <motion.div className="text-[#656565] dark:text-gray-400 sm:text-base text-xs">
                                        {aboutUsData?.stat3Label}
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

