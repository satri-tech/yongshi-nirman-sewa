'use client'

import ImageSwiper from "@/features/shared/components/ImageSwiper";
import {
    AnimatedTitle,
    AnimatedDescription,
    AnimatedButton,
    AnimatedImageContainer
} from '@/features/animations/components/animated-component';
import { fadeInDown } from "@/features/shared/hooks/use-scroll-animation";
import InteractiveButton from "./InteractiveButton";
import { data, SwiperImages } from "../constants/constants";

interface LandingPageData {
  id: string;
  title: string;
  description: string;
  sliderImages: string[];
  createdAt: string;
  updatedAt: string;
}

interface HeroSectionProps {
  landingData?: LandingPageData | null;
}

export default function HeroSection({ landingData }: HeroSectionProps) {
  // Use landing data if available, otherwise fall back to constants
  const title = landingData?.title || data.title;
  const description = landingData?.description || data.description;
  
  // Map slider images to full paths
  const sliderImages = landingData?.sliderImages?.length 
    ? landingData.sliderImages.map(img => `/api/images/projects/${img}`)
    : SwiperImages;

  return (
    <section className="h-max l:w-[92%] w-[90%] flex flex-col sm:gap-10 gap-6 z-49 ">
      <div className="flex md:flex-row flex-col md:justify-between w-full md:gap-2 gap-4">
        <AnimatedTitle variants={fadeInDown}
          className="md:w-6/12 md:text-5xl sm:text-5xl text-4xl sm:font-medium font-semibold font-Poppins md:leading-[4.9rem] ">
          {title}
        </AnimatedTitle>

        <div className="md:w-5/12 md:p-6 font-Poppins  flex flex-col gap-6 text-justify">
          <AnimatedDescription variants={fadeInDown} className="md:text-lg text-base z-49">
            {description}
          </AnimatedDescription>

          <AnimatedButton>
            <InteractiveButton />
          </AnimatedButton>
        </div>

      </div>

      <AnimatedImageContainer className="bg-secondary-text h-[32rem]">
        <ImageSwiper
          swiperImages={sliderImages}
          imageClass={"object-cover w-full h-[32rem]"}
        />
      </AnimatedImageContainer>
    </section>
  );
}