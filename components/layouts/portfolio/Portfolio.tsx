'use client'
import EachProjectCard from "./EachProjectCard";
import HeaderTitle from "@/components/ui/HeaderTitle";
import { usePortfolio } from "./usePortfolio";
const Portfolio = () => {
    const { projectsdata } = usePortfolio()


    return (
        <div id="portfolio"
            className={`flex lg:flex-row flex-col justify-center items-center w-full mt-24 h-max border-t-[0.1px] font-Poppins sm:pt-16 pt-8`}
        >
            <div className="font-Poppins flex flex-col  lg:w-[92%] w-[90%] ">
                <div className="flex w-full sm:gap-10 gap-4 flex-col ">
                    <HeaderTitle header={"Portfolio"} />
                    <div className="w-full flex">
                        <div className="w-full sm:text-5xl text-3xl font-medium leading-[4.4rem] tracking-tight">
                            Let's dive into our Journey!
                        </div>
                    </div>
                    {/* Updated Grid */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 2md:grid-cols-3 gap-x-8 sm:gap-y-16 gap-y-12 justify-items-center ">
                        {projectsdata.map((data) => (
                            <EachProjectCard key={data.id} project={data} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
