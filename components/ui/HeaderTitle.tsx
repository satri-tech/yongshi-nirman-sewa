interface IHeaderTitle {
    header: string;
}

const HeaderTitle = ({ header }: IHeaderTitle) => {
    return (
        <div className="w-full flex flex-col    ">
            <div className="w-24 h-10 px-2 py-2 border-2 rounded-full flex justify-center items-center border-[#3b3b3b] text-[#3b3b3b] text-sm hover:bg-black hover:text-white cursor-pointer transition-all duration-500">
                {header}
            </div>
        </div>
    );
};

export default HeaderTitle;
