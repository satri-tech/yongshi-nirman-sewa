import HeaderTitle from "@/components/ui/HeaderTitle";


export default function Testimonials() {
    return <div id="team"
        className={`flex lg:flex-row flex-col justify-center items-center w-full mt-24 h-max border-t-[0.1px] font-Poppins sm:pt-16 pt-8`}
    >
        <div className="font-Poppins flex flex-col  lg:w-[92%] w-[90%] ">
            <div className="flex w-full sm:gap-6 gap-4 flex-col ">
                <HeaderTitle header={"Testimonials"} className="w-[120px]" />
                <div className="w-full flex">
                    <div className="w-full sm:text-5xl text-3xl font-medium leading-[4.4rem] tracking-tight">
                        {`Trusted by clients who value quality and results.`}
                    </div>
                </div>
                <div className="mt-6 md:mt-8">
                    Testimonials Marquee
                </div>
            </div>
        </div>
    </div >
}