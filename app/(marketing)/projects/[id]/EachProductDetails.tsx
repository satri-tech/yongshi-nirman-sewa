'use client'
import { useState } from "react"
import { IProject } from "@/app/actions/fetchProjects"
import { formatDate } from "@/lib/utils/formatDate"
import Image from "next/image"

interface IEachProductDetailsProps {
    data?: IProject
}

export default function EachProductDetails({ data }: IEachProductDetailsProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageSelect = (index: number) => {
        setSelectedImageIndex(index);
    };

    return (
        <div className="w-[90%] h-full flex flex-col md:flex-row gap-5 mt-3">
            {/* Left Section */}
            <div className="w-full h-auto flex flex-col gap-2">
                <div className="text-2xl font-Mono font-medium tracking-wide block sm:hidden">
                    {data?.title}
                </div>
                <div className="md:h-[30rem] h-[20rem] w-full">
                    {data?.images && data?.images.length > 0 && (
                        <Image
                            height={1200}
                            width={800}
                            src={`/api/images/projects/${data.images[selectedImageIndex]}`}
                            alt={`${data?.title} - Image ${selectedImageIndex + 1}`}
                            className="md:h-[30rem] h-[20rem] w-full object-cover rounded-lg transition-all duration-300 ease-in-out"
                        />
                    )}
                </div>
                <div className="w-full h-auto grid grid-cols-3 l:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {data?.images?.map((imageUrl, index) => (
                        <div
                            key={index}
                            onClick={() => handleImageSelect(index)}
                            className={`rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${
                                selectedImageIndex === index 
                                    ? 'sm:h-24 h-20 w-full border-2 border-purple-600 bg-white dark:bg-gray-800 shadow-lg ring-2 ring-purple-300 ring-opacity-50' 
                                    : 'sm:h-24 h-20 w-full border-2 border-gray-300 border-opacity-50 bg-gray-50 dark:bg-gray-700 shadow-md hover:border-gray-400'
                            }`}
                        >
                            <div className={`w-full h-full p-1 ${selectedImageIndex === index ? 'p-1.5' : 'p-1'}`}>
                                <Image
                                    src={`/api/images/projects/${imageUrl}`}
                                    height={100}
                                    width={100}
                                    alt={`${data?.title} thumbnail ${index + 1}`}
                                    className="h-full w-full object-cover rounded-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Section - Details */}
            <div className="w-full p-4 flex flex-col gap-5">
                <div className="text-4xl font-Mono font-medium tracking-wide hidden md:block">
                    {data?.title}
                </div>
                <div className="flex">
                    <div className="w-32 flex flex-col sm:text-sm text-xs font-Poppins font-medium tracking-wide gap-2">
                        <div>LOCATION</div>
                        <div>CLIENT</div>
                        <div>START DATE</div>
                        <div>End DATE</div>
                        <div>AREA</div>
                        <div>STATUS</div>
                    </div>
                    <div className="w-60 flex flex-col sm:text-sm text-xs font-Poppins font-medium tracking-wide gap-2">
                        <div>{data?.location}</div>
                        <div>{data?.client}</div>
                        <div>{formatDate(data?.startDate)}</div>
                        <div>{formatDate(data?.endDate)}</div>
                        <div>{data?.area} SQ FEET</div>
                        <div>{data?.status}</div>
                    </div>
                </div>
                <div className="font-Poppins tracking-wider leading-7 text-justify text-base">
                    {data?.description}
                </div>
            </div>
        </div>
    )
}