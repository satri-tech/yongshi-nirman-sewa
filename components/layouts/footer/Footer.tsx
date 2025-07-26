import React, { useEffect, useState } from "react";
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
            window.scrollTo({ behavior: "smooth", top: 0 });
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
        <div className="w-full flex flex-col items-center bg-[#0b0b0b] text-white sm:pb-10 tracking-wide ">

            <div className="w-10/12 flex flex-col  gap-1 font-Poppins sm:mt-32 mt-10 z-49 pb-10 ">
                <div className=" h-32 w-full">
                    <div className="text-3xl font-semibold font-Poppins ">
                        Yongshi Construction
                    </div>
                    <div className="text-secondary-text">
                        देश बनाउने सिलसिला जारी छ।
                    </div>
                </div>

                <div className="md:flex md:flex-row flex-col  grid grid-cols-2 gap-y-10  w-full  ">
                    <div className="flex flex-col gap-4 w-full  text-xl font-Poppins">
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
                    <div className="flex flex-col gap-4 w-full  text-xl font-Poppins">
                        {socialmedia.map((data, index) => {
                            return (
                                <a
                                    href={data.href}
                                    target="_blank"
                                    key={index}
                                    className="flex items-center gap-2 cursor-pointer hover:underline"
                                >
                                    <div className="text-base text-secondary-text hover:text-white">
                                        {" "}
                                        {data.name}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                    <div className="flex flex-col gap-5  w-64 sm:w-full text-xl font-Poppins">
                        <a
                            className="flex items-center gap-2 text-secondary-text hover:text-white "
                            href="mailto:mantra.design55@gmail.com"
                        >
                            <CiMail />
                            <div className="text-sm   "> yongshi899@gmail.com</div>
                        </a>
                        <a
                            className="flex   items-center gap-2 text-secondary-text hover:text-white"
                            href="tel:9861366033"
                        >
                            <BsTelephone />
                            <div className="text-sm  ">98XXXXXXXX </div>
                        </a>
                    </div>
                    <div className="md:flex flex-col gap-5  w-full text-xl font-Poppins hidden  ">
                        <div className="text-sm">Join our newsletter</div>

                        <input
                            type="text"
                            placeholder="Your Email"
                            className="placeholder:text-xs text-xs w-full bg-[#0b0b0b]  border-2 border-secondary-text h-12 rounded-md focus:outline-none pl-4  font-Poppins font-normal tracking-wide"
                        />
                        <button
                            type="button"
                            className="bg-white px-2 text-black rounded-md py-2 text-sm font-Poppins :scale-105"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-11/12 flex justify-end text-secondary-text text-sm pt-2  pb-2 border-t-[0.5px] border-secondary-text">
                © 2025 Yongshi Construction. All rights reserved
            </div>
        </div>
    );
};

export default Footer;
