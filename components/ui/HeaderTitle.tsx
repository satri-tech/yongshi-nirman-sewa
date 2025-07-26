interface IHeaderTitle {
    header: string;
}

const HeaderTitle = ({ header }: IHeaderTitle) => {
    return (
        <div className="w-full flex flex-col    ">
            <div className="w-[100px] h-10 px-2 py-2 border-2 rounded-full flex justify-center items-center bg-black text-white border-[#3b3b3b]  text-sm hover:bg-neutral-950 hover:text-neutral-50 cursor-pointer transition-all duration-500">
                {header}
            </div>
        </div>
    );
};

export default HeaderTitle;
