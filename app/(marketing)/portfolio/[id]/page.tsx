'use client'

import React, { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import Image1 from "@/public/projects/img1.jpg"
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
// Static portfolio data (mock)
const mockPortfolioData = {
    id: "1",
    Name: "Modern Villa Project",
    projectImage: Image1,
    Images: [
        Image1,
        Image1,
        Image1,
        Image1,
        Image1
    ],
    Location: "Pokhara, Nepal",
    Client: "Mr. Shrestha",
    Year: "2024",
    Area: "5000 sq.ft.",
    Status: "Completed",
    Description:
        "This modern villa project features state-of-the-art architecture, spacious interiors, and a beautiful landscape view. The project reflects our commitment to design excellence and client satisfaction.",
};

export default function EachPortfolioDetails({ params }: { params: Promise<{ id: string }> }) {
    console.log(params)
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState<typeof mockPortfolioData | null>(null);
    const [selectedImage, setSelectedImage] = useState<StaticImageData>();

    useEffect(() => {
        // Simulate async data loading
        setTimeout(() => {
            setProduct(mockPortfolioData);
            setSelectedImage(mockPortfolioData.projectImage);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleThumbnailClick = (image: StaticImageData) => {
        setSelectedImage(image);
    };

    if (isLoading) {
        return (
            <div className="w-full flex justify-center h-screen">
                <div className="w-[90%] h-full flex flex-col md:flex-row gap-5 mt-4">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-[90%] text-secondary-text font-Poppins text-sm flex items-center ">
                <Link className="hover:underline" href={'/'}>Home</Link>
                <BsDot className="text-2xl" />
                <p className="hover:underline cursor-pointer">Portfolios</p>
                <BsDot className="text-2xl" />
                <p className="hover:underline cursor-pointer">{mockPortfolioData.Name}</p>
            </div>

            <div className="w-[90%] h-full flex flex-col md:flex-row gap-5 mt-3">
                {/* Left Section */}
                <div className="w-full h-auto flex flex-col gap-2">
                    <div className="text-2xl font-Mono font-medium tracking-wide block sm:hidden">
                        {product?.Name}
                    </div>
                    <div className="md:h-[30rem] h-[20rem] w-full">
                        {selectedImage && (
                            <Image
                                height={1200}
                                width={800}
                                src={selectedImage}
                                alt=""
                                className="md:h-[30rem] h-[20rem] w-full object-cover rounded-lg"
                            />
                        )}

                    </div>
                    <div className="w-full h-auto grid grid-cols-3 l:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {product?.Images.map((data, index) => (
                            <div
                                key={index}
                                className={`sm:h-24 h-20 w-full rounded-md cursor-pointer ${selectedImage === data ? "border-2 border-purple-700 shadow-md" : ""
                                    }`}
                                onClick={() => handleThumbnailClick(data)}
                            >
                                <Image
                                    src={data.src}
                                    height={100}
                                    width={100}
                                    alt=""
                                    className="h-full w-full object-cover rounded-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section - Details */}
                <div className="w-full p-4 flex flex-col gap-5">
                    <div className="text-4xl font-Mono font-medium tracking-wide hidden md:block">
                        {product?.Name}
                    </div>
                    <div className="flex">
                        <div className="w-32 flex flex-col sm:text-sm text-xs font-Poppins font-medium tracking-wide gap-2">
                            <div>LOCATION</div>
                            <div>CLIENT</div>
                            <div>YEAR</div>
                            <div>AREA</div>
                            <div>STATUS</div>
                        </div>
                        <div className="w-60 flex flex-col sm:text-sm text-xs font-Poppins font-medium tracking-wide gap-2">
                            <div>{product?.Location}</div>
                            <div>{product?.Client}</div>
                            <div>{product?.Year}</div>
                            <div>{product?.Area}</div>
                            <div>{product?.Status}</div>
                        </div>
                    </div>
                    <div className="font-Poppins tracking-wider leading-7 text-justify text-base">
                        {product?.Description}
                    </div>
                </div>
            </div>
        </div >
    );
}
