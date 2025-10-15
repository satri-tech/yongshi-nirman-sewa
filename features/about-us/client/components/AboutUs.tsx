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

interface IAboutUsProps {
    aboutUsData: IAboutUs | null
}
export default function AboutUs({ aboutUsData }: IAboutUsProps) {
    const statsAnimation = useScrollAnimation(0.2, true);


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
                        {aboutUsData?.mainHeading}
                    </AnimatedTitle>
                    <div

                        className=" sm:w-6/12 flex flex-col  sm:gap-14 gap-6 "
                    >
                        <AnimatedDescription
                            className="text-[#212121] sm:text-lg text-base tracking-wide text-justify sm:leading-7 leading-7 sm:pt-4"
                        >
                            {aboutUsData?.description}
                        </AnimatedDescription>
                        <div
                        >
                            <motion.div
                                ref={statsAnimation.ref}
                                variants={staggerContainer}
                                initial="hidden"
                                animate={statsAnimation.controls}
                                className="flex justify-between gap-16 font-Poppins "
                            >
                                <motion.div
                                    variants={staggerItem}
                                    className="flex flex-col sm:gap-4"
                                >
                                    <motion.div className={`sm:text-5xl text-3xl font-medium `}>
                                        {aboutUsData?.stat1Number}
                                    </motion.div>
                                    <motion.div className="text-[#656565] sm:text-base text-xs ">
                                        {aboutUsData?.stat1Label}
                                    </motion.div>
                                </motion.div>
                                <motion.div
                                    variants={staggerItem}
                                    className="flex flex-col sm:gap-4"
                                >
                                    <motion.div className={`sm:text-5xl text-3xl font-medium `}>
                                        {aboutUsData?.stat2Number}
                                    </motion.div>
                                    <motion.div className="text-[#656565] sm:text-base text-xs ">
                                        {aboutUsData?.stat2Label}
                                    </motion.div>
                                </motion.div>
                                <motion.div
                                    variants={staggerItem}
                                    className="flex flex-col sm:gap-4"
                                >
                                    <motion.div className={`sm:text-5xl text-3xl font-medium `}>
                                        {aboutUsData?.stat3Number}
                                    </motion.div>
                                    <motion.div className="text-[#656565] sm:text-base text-xs ">
                                        {aboutUsData?.stat3Label}
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                            <div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </div>
    );
};

