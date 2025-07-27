import { cn } from "@/lib/utils";

interface IHeaderTitle {
    header: string;
    className?: string
}

const HeaderTitle = ({ header, className }: IHeaderTitle) => {
    return (
        <div className="w-full flex flex-col    ">
            <div className={cn("w-[100px] h-10 px-2 py-2 border-2 rounded-full flex justify-center items-center bg-black text-white border-[#3b3b3b]  text-sm hover:bg-neutral-950 hover:text-neutral-50 cursor-pointer transition-all duration-500", className)} >
                {header}
            </div>
        </div>
    );
};

export default HeaderTitle;
