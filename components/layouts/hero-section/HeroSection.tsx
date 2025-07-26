import ImageSwiper from "@/components/ui/ImageSwiper";
import { SwiperImages } from './constants'
import { ArrowRight } from "lucide-react";
import { data } from './constants'
export default function HeroSection() {
    return (
        <section className="h-max l:w-[92%] w-[90%] flex flex-col gap-10  z-49">
            <div className="flex md:flex-row flex-col  md:justify-between w-full md:gap-2 gap-4 ">
                <div className="md:w-6/12  md:text-6xl sm:text-5xl text-4xl font-medium font-Poppins md:leading-[4.9rem]">
                    {data.title}
                </div>
                <div className="md:w-5/12  md:p-6 font-Poppins text-lg flex flex-col gap-6 text-justify">
                    <div className='md:text-lg z-49'>
                        {data.description}
                    </div>
                    <div className="h-12 w-44 text-sm flex justify-center items-center bg-black text-white rounded-full cursor-pointer px-1 gap-2 hover:scale-105 transition-transform duration-500" >
                        <div > Learn More</div>
                        <div className="text-2xl">
                            <ArrowRight size={17} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-secondary-text  h-[32rem]">
                <ImageSwiper
                    swiperImages={SwiperImages}
                    imageClass={"object-cover w-full h-[32rem]"}
                />
            </div>
        </section>)

}