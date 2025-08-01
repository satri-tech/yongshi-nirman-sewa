import ImageSwiper from "@/components/ui/ImageSwiper";
import { SwiperImages } from './constants'
import { data } from './constants'
import {
    AnimatedTitle,
    AnimatedDescription,
    AnimatedButton,
    AnimatedImageContainer
} from '@/components/animations/animated-component';
import InteractiveButton from "./InteractiveButton";

export default function HeroSection() {

    return (
        <section className="h-max l:w-[92%] w-[90%] flex flex-col gap-10 z-49">
            <div className="flex md:flex-row flex-col md:justify-between w-full md:gap-2 gap-4">
                <AnimatedTitle className="md:w-6/12 md:text-6xl sm:text-5xl text-4xl font-medium font-Poppins md:leading-[4.9rem]">
                    {data.title}
                </AnimatedTitle>

                <div className="md:w-5/12 md:p-6 font-Poppins text-lg flex flex-col gap-6 text-justify">
                    <AnimatedDescription className="md:text-lg z-49">
                        {data.description}
                    </AnimatedDescription>

                    <AnimatedButton>
                        <InteractiveButton />
                    </AnimatedButton>
                </div>

            </div>

            <AnimatedImageContainer className="bg-secondary-text h-[32rem]">
                <ImageSwiper
                    swiperImages={SwiperImages}
                    imageClass={"object-cover w-full h-[32rem]"}
                />
            </AnimatedImageContainer>
        </section>
    );
}