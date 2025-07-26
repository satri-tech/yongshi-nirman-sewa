import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { ISidebarProps } from "./types";

const Sidebar = ({ sidebar, handleToggleMenu }: ISidebarProps) => {
    const links = [
        {
            linkName: "Home",
            id: "home",
        },
        {
            linkName: "About Us",
            id: "about",
        },
        {
            linkName: "Services",
            id: "services",
        },
        {
            linkName: "Portfolio",
            id: "portfolio",
        },
        {
            linkName: "Team",
            id: "team",
        },
        {
            linkName: "Contact",
            id: "contact",
        },
    ];
    const [menuList, setMenuList] = useState(false);
    useEffect(() => {
        if (sidebar) {
            setTimeout(() => {
                setMenuList(true);
            }, 500);
        } else {
            setMenuList(false);
        }
    }, [sidebar]);
    const navigateToLink = (id: string) => {
        if (id === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            handleToggleMenu(false);
        }
        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            handleToggleMenu(false);
        }
    };
    return (
        <div
            className={`  font-Poppins min-h-screen overflow-hidden flex sm:flex-row flex-col-reverse fixed z-50 top-0 right-0 bg-black duration-500   ${sidebar ? "w-[100%]" : "w-0"
                }`}
        >
            <div
                className="text-4xl cursor-pointer z-50 absolute right-12 text-white top-6 hover:scale-125 transition-all duration-300"
                onClick={() => {
                    handleToggleMenu(false);
                }}
            >
                <IoCloseOutline />
            </div>
            <div className="sm:w-1/2 sm:h-screen h-60 text-black sm:mb-0 mb-auto bg-white   flex flex-col justify-center items-center pb-5">
                <div className="w-fit h-4/5 flex flex-col items-center justify-center">
                    <div
                        className={`w-fit flex flex-col items-center justify-center gap-5 text-4xl text-center font-Poppins tracking-normal duration-100 opacity-0 overflow-hidden ${menuList && "opacity-100"
                            }`}
                    >
                        <div className="font-Poppins text-[500] sm:text-4xl text-2xl tracking-normal">
                            Have an Idea?
                        </div>
                        <div
                            className={`sm:text-5xl text-4xl font-light tracking-normal bg-gradient peer hover:cursor-pointer relative duration-500 ${menuList ? "translate-y-0" : "translate-y-[150%]"
                                }`}
                            style={{
                                background: "linear-gradient(to right, #1e3a8a, #6b21a8)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                            onClick={() => navigateToLink("contact")}
                        >
                            {`Let's Talk about it`}
                        </div>
                        <div className="h-[3px] w-full bg-gray-300 transition duration-500 ease-in-out peer-hover:bg-transparent  "></div>
                    </div>
                </div>
                <div
                    className={`text-gray-500 flex gap-1 flex-col 
             items-baseline duration-100 opacity-0 ${menuList && "opacity-100"
                        }`}
                >
                    <div className=" text-center sm:text-4xl text-3xl  font-medium text-gray-800 ">
                        Yongshi Construction
                    </div>
                    <div className=" flex flex-col gap-1 text-sm">Pokhara, Nepal</div>
                </div>
            </div>
            <div className="sm:w-1/2 sm:h-screen h-1/2 bg-black sm:mb-0 mb-auto text-white flex sm:flex-col items-center justify-center sm:pl-0 pl-6">
                <div className="flex sm:flex-col flex-row sm:gap-20 w-full sm:pl-10  ">
                    <div className="w-4/5 h-4/5 p-4 gap-24 flex justify-center items-center ">
                        <ul
                            className={`w-full flex flex-col justify-center text-start sm:text-4xl text-xl sm:gap-12 gap-8 font-semibold duration-100 opacity-0 ${menuList && "opacity-100"
                                }`}
                        >
                            {links.map((data, index) => {
                                return (
                                    <li
                                        key={index}
                                        className="cursor-pointer text-start"
                                        onClick={() => navigateToLink(data.id)}
                                    >
                                        {data.linkName}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className=" flex ">
                        <ul
                            className={`flex sm:flex-row flex-col  p-4 gap-10 items-center text-lg duration-100 opacity-0 ${menuList && "opacity-100"
                                }`}
                        >
                            <a
                                href="https://www.facebook.com/profile.php?id=100092500657153"
                                target="_blank"
                            >
                                <FaFacebookSquare />
                            </a>
                            <a
                                href="https://www.instagram.com/_mantrarchitects/"
                                target="_blank"
                            >
                                <BsInstagram />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/aayush-khadka-a3858a1b5/"
                                target="_blank"
                            >
                                <FaLinkedin />
                            </a>
                        </ul>
                    </div>
                </div>
            </div>
            <div
                className={`text-white  mb-auto pt-6 font-semibold text-2xl flex flex-col  sm:hidden sm:pl-0 pl-6 duration-100 opacity-0 ${menuList && "opacity-100"
                    }`}
            >
                <div>Mantra Architects</div>
                <div className="text-xs font-medium text-secondary-text">
                    देश बनाउने सिलसिला जारी छ।{" "}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
