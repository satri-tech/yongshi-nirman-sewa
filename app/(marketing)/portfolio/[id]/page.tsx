import { BsDot } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { fetchProjectById } from "@/app/actions/fetchProjects";
import { formatDate } from "@/lib/utils/formatDate";

export const revalidate = 3600;

export default async function EachPortfolioDetails({ params }: { params: Promise<{ id: string }> }) {
    const response = await fetchProjectById((await params).id)
    const data = response.data;
    if (!response.success) {
        return (
            <div className="w-full flex justify-center h-screen">
                <div className="w-[90%] h-full flex flex-col md:flex-row gap-5 mt-4">
                    Error Fetching Data
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
                <p className="hover:underline cursor-pointer">{data?.title}</p>
            </div>

            <div className="w-[90%] h-full flex flex-col md:flex-row gap-5 mt-3">
                {/* Left Section */}
                <div className="w-full h-auto flex flex-col gap-2">
                    <div className="text-2xl font-Mono font-medium tracking-wide block sm:hidden">
                        {data?.title}
                    </div>
                    <div className="md:h-[30rem] h-[20rem] w-full">
                        {data?.images && (
                            <Image
                                height={1200}
                                width={800}
                                src={`/api/images/projects/${data.images[0]}`}
                                alt=""
                                className="md:h-[30rem] h-[20rem] w-full object-cover rounded-lg"
                            />
                        )}

                    </div>
                    <div className="w-full h-auto grid grid-cols-3 l:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {data?.images.map((data, index) => (
                            <div
                                key={index}
                                className={`sm:h-24 h-20 w-full rounded-md cursor-pointer  border-2 border-purple-700 shadow-md"
                                    }`}
                            >
                                <Image
                                    src={`/api/images/projects/${data}`}
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
                        {data?.title}
                    </div>
                    <div className="flex">
                        <div className="w-32 flex flex-col sm:text-sm text-xs font-Poppins font-medium tracking-wide gap-2">
                            <div>LOCATION</div>
                            <div>CLIENT</div>
                            <div>START YEAR</div>
                            <div>End YEAR</div>
                            <div>AREA</div>
                            <div>STATUS</div>
                        </div>
                        <div className="w-60 flex flex-col sm:text-sm text-xs font-Poppins font-medium tracking-wide gap-2">
                            <div>{data?.location}</div>
                            <div>{data?.client}</div>
                            <div>{formatDate(data?.startDate)}</div>
                            <div>{formatDate(data?.endDate)}</div>
                            <div>{data?.area}</div>
                            <div>{data?.status}</div>
                        </div>
                    </div>
                    <div className="font-Poppins tracking-wider leading-7 text-justify text-base">
                        {data?.description}
                    </div>
                </div>
            </div>
        </div >
    );
}
