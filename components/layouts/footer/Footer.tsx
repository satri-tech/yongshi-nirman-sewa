import { CiMail } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";

import {
    FaInstagram,
    FaFacebookSquare,
    FaLinkedin,
    FaDribbbleSquare,
    FaPinterestSquare,
    FaYoutube,
} from "react-icons/fa";
import { scrollToElement } from "@/lib/utils/scroll";

const Footer = () => {

    const handleMenuClick = (id: string) => {
        if (id === "home") {
            if (typeof window !== "undefined") {
                window.scrollTo({ behavior: "smooth", top: 0 });
            }
            return;
        }
        scrollToElement(id);
    };

    const links = [
        {
            title: "Home",
            id: "home",
        },
        {
            title: "About us",
            id: "about",
        },
        {
            title: "Services",
            id: "services",
        },
        {
            title: "Portfolio",
            id: "portfolio",
        },
        {
            title: "Team",
            id: "team",
        },
        {
            title: "Contact",
            id: "contact",
        },
    ];

    const socialmedia = [
        {
            name: "Instagram",
            href: "https://www.instagram.com/_mantrarchitects/",
            icon: FaInstagram,
        },
        {
            name: "Facebook",
            href: "https://www.facebook.com/profile.php?id=100092500657153",
            icon: FaFacebookSquare,
        },
        {
            name: "Linkedin",
            href: "https://www.linkedin.com/",
            icon: FaLinkedin,
        },
        {
            name: "Dribble",
            href: "https://dribbble.com/",
            icon: FaDribbbleSquare,
        },
        {
            name: "Pintrest",
            href: "https://www.pinterest.com/",
            icon: FaPinterestSquare,
        },
        {
            name: "Youtube",
            href: "https://www.youtube.com/",
            icon: FaYoutube,
        },
    ];

    return (
        <div className="w-full flex flex-col items-center bg-[#0b0b0b] text-white sm:pb-10 tracking-wide relative overflow-hidden">

            {/* Background SVG */}
            <div className="absolute inset-0 flex items-end opacity-70 justify-center pointer-events-none h-full  p-4 ">
                <svg
                    width="1364"
                    height="217"
                    viewBox="0 0 1364 217"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto opacity-30 scale-150 md:scale-125 lg:scale-100"
                >
                    <path
                        opacity="0.7"
                        d="M197.854 3.39999L124.954 144.4V214H73.6543V144.4L0.754297 3.39999H58.9543L99.7543 91.6L140.254 3.39999H197.854ZM318.124 216.1C298.324 216.1 280.124 211.5 263.524 202.3C247.124 193.1 234.024 180.3 224.224 163.9C214.624 147.3 209.824 128.7 209.824 108.1C209.824 87.5 214.624 69 224.224 52.6C234.024 36.2 247.124 23.4 263.524 14.2C280.124 5 298.324 0.399996 318.124 0.399996C337.924 0.399996 356.024 5 372.424 14.2C389.024 23.4 402.024 36.2 411.424 52.6C421.024 69 425.824 87.5 425.824 108.1C425.824 128.7 421.024 147.3 411.424 163.9C401.824 180.3 388.824 193.1 372.424 202.3C356.024 211.5 337.924 216.1 318.124 216.1ZM318.124 169.3C334.924 169.3 348.324 163.7 358.324 152.5C368.524 141.3 373.624 126.5 373.624 108.1C373.624 89.5 368.524 74.7 358.324 63.7C348.324 52.5 334.924 46.9 318.124 46.9C301.124 46.9 287.524 52.4 277.324 63.4C267.324 74.4 262.324 89.3 262.324 108.1C262.324 126.7 267.324 141.6 277.324 152.8C287.524 163.8 301.124 169.3 318.124 169.3ZM642.764 214H591.464L505.664 84.1V214H454.364V3.39999H505.664L591.464 133.9V3.39999H642.764V214ZM819.75 70C815.95 63 810.45 57.7 803.25 54.1C796.25 50.3 787.95 48.4 778.35 48.4C761.75 48.4 748.45 53.9 738.45 64.9C728.45 75.7 723.45 90.2 723.45 108.4C723.45 127.8 728.65 143 739.05 154C749.65 164.8 764.15 170.2 782.55 170.2C795.15 170.2 805.75 167 814.35 160.6C823.15 154.2 829.55 145 833.55 133H768.45V95.2H880.05V142.9C876.25 155.7 869.75 167.6 860.55 178.6C851.55 189.6 840.05 198.5 826.05 205.3C812.05 212.1 796.25 215.5 778.65 215.5C757.85 215.5 739.25 211 722.85 202C706.65 192.8 693.95 180.1 684.75 163.9C675.75 147.7 671.25 129.2 671.25 108.4C671.25 87.6 675.75 69.1 684.75 52.9C693.95 36.5 706.65 23.8 722.85 14.8C739.05 5.59999 757.55 0.999989 778.35 0.999989C803.55 0.999989 824.75 7.09999 841.95 19.3C859.35 31.5 870.85 48.4 876.45 70H819.75ZM984.665 216.1C969.265 216.1 955.465 213.6 943.265 208.6C931.065 203.6 921.265 196.2 913.865 186.4C906.665 176.6 902.865 164.8 902.465 151H957.065C957.865 158.8 960.565 164.8 965.165 169C969.765 173 975.765 175 983.165 175C990.765 175 996.765 173.3 1001.17 169.9C1005.57 166.3 1007.77 161.4 1007.77 155.2C1007.77 150 1005.97 145.7 1002.37 142.3C998.965 138.9 994.665 136.1 989.465 133.9C984.465 131.7 977.265 129.2 967.865 126.4C954.265 122.2 943.165 118 934.565 113.8C925.965 109.6 918.565 103.4 912.365 95.2C906.165 87 903.065 76.3 903.065 63.1C903.065 43.5 910.165 28.2 924.365 17.2C938.565 6 957.065 0.399996 979.865 0.399996C1003.07 0.399996 1021.77 6 1035.97 17.2C1050.17 28.2 1057.77 43.6 1058.77 63.4H1003.27C1002.87 56.6 1000.37 51.3 995.765 47.5C991.165 43.5 985.265 41.5 978.065 41.5C971.865 41.5 966.865 43.2 963.065 46.6C959.265 49.8 957.365 54.5 957.365 60.7C957.365 67.5 960.565 72.8 966.965 76.6C973.365 80.4 983.365 84.5 996.965 88.9C1010.57 93.5 1021.57 97.9 1029.97 102.1C1038.57 106.3 1045.97 112.4 1052.17 120.4C1058.37 128.4 1061.47 138.7 1061.47 151.3C1061.47 163.3 1058.37 174.2 1052.17 184C1046.17 193.8 1037.37 201.6 1025.77 207.4C1014.17 213.2 1000.47 216.1 984.665 216.1ZM1275.44 3.39999V214H1224.14V127.3H1144.34V214H1093.04V3.39999H1144.34V85.9H1224.14V3.39999H1275.44ZM1363.77 3.39999V214H1312.47V3.39999H1363.77Z"
                        fill="url(#paint0_linear_2_2)"
                    />
                    <defs>
                        <linearGradient id="paint0_linear_2_2" x1="-12" y1="51" x2="1393" y2="51" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#493F3F" stopOpacity="0.77" />
                            <stop offset="0.509615" stopColor="#585252" stopOpacity="0.77" />
                            <stop offset="1" stopColor="#493F3F" stopOpacity="0.77" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Content with higher z-index */}
            <div className="w-10/12 flex flex-col gap-1 font-Poppins sm:mt-20 mt-10 z-50 pb-6 relative">
                <div className="h-32 w-full ">
                    <div className="text-3xl font-semibold font-Poppins">
                        Yongshi Construction
                    </div>
                    <div className="text-secondary-text">
                        देश बनाउने सिलसिला जारी छ।
                    </div>
                </div>

                <div className="md:flex md:flex-row flex-col grid grid-cols-2 gap-y-10 w-full">
                    <div className="flex flex-col gap-4 w-full text-xl font-Poppins">
                        {links.map((data, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 cursor-pointer hover:underline text-base text-secondary-text hover:text-white"
                                    onClick={() => handleMenuClick(data.id)}
                                >
                                    {data.title}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-col gap-4 w-full text-xl font-Poppins">
                        {socialmedia.map((data, index) => {
                            return (
                                <a
                                    href={data.href}
                                    target="_blank"
                                    key={index}
                                    className="flex items-center gap-2 cursor-pointer hover:underline"
                                >
                                    <div className="text-base text-secondary-text hover:text-white">
                                        {data.name}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                    <div className="flex flex-col gap-5 w-64 sm:w-full text-xl font-Poppins">
                        <a
                            className="flex items-center gap-2 text-secondary-text hover:text-white"
                            href="mailto:yongshi899@gmail.com"
                        >
                            <CiMail />
                            <div className="text-sm">yongshi899@gmail.com</div>
                        </a>
                        <a
                            className="flex items-center gap-2 text-secondary-text hover:text-white"
                            href="tel:98XXXXXXXX"
                        >
                            <BsTelephone />
                            <div className="text-sm">98XXXXXXXX</div>
                        </a>
                    </div>
                    <div className="md:flex flex-col gap-5 w-full text-xl font-Poppins hidden">
                        <div className="text-sm">Join our newsletter</div>

                        <input
                            type="text"
                            placeholder="Your Email"
                            className="placeholder:text-xs text-xs w-full bg-[#0b0b0b] border-2 border-neutral-800 h-12 rounded-md focus:outline-none pl-4 font-Poppins font-normal tracking-wide"
                        />
                        <button
                            type="button"
                            className="bg-white px-2 text-black rounded-md py-2 text-sm font-Poppins hover:scale-105"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-11/12 flex justify-end text-secondary-text text-sm pt-2 pb-2 relative z-50">
                © 2025 Yongshi Construction. All rights reserved
            </div>
        </div>
    );
};

export default Footer;