'use client'
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Navigation,
    Pagination,
    Scrollbar,
    A11y,
    Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Image, { StaticImageData } from "next/image";

interface IImageSwiper {
    swiperImages: (string | StaticImageData)[]; // Accept both string URLs and StaticImageData
    imageClass: string;
}

const ImageSwiper = ({ swiperImages, imageClass }: IImageSwiper) => {
    return (
        <>
            <Swiper
                modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                loop={true}
            >
                {swiperImages.map((image, index) => {
                    const imageSrc = typeof image === 'string' ? image : image.src;

                    return (
                        <SwiperSlide key={index}>
                            <Image width={1600} height={900} src={imageSrc} alt="sliderImages" className={imageClass} />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </>
    );
};

export default ImageSwiper;