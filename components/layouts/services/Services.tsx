'use client'
import { AiOutlineMinus } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import HeaderTitle from "@/components/ui/HeaderTitle";
import { servicesData } from "./constants";
import { useServices } from "./useServices";

const Services = () => {
    const { activeImage, activeService, handleServiceClick } = useServices();

    return (
        <div id="services" className="flex lg:flex-row flex-col justify-center items-center mt-24 h-max border-t-[0.1px] font-Poppins sm:pt-16 pt-8">
            <div className="flex lg:w-[92%] w-[90%] sm:gap-10 gap-4 flex-col">
                <HeaderTitle header={"Services"} />
                <div className="w-full flex sm:flex-row flex-col sm:gap-10 gap-4">
                    <div className="sm:w-6/12 sm:text-5xl text-3xl font-medium sm:leading-[4.4rem] flex flex-col tracking-tight sm:gap-20 gap-6">
                        <div>Explore the variety of services we provide.</div>
                        <div className="h-96 w-full">
                            <motion.img
                                key={activeImage}
                                className="w-full h-full object-cover"
                                src={activeImage}
                                alt="Selected Service"
                                initial={{ opacity: 0.6, x: -200 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                    <div className="sm:w-6/12 flex flex-col sm:gap-14 gap-6">
                        <div className="text-[#212121] text-lg tracking-wide text-justify leading-8 pt-4">
                            At Yongshi Construction, we offer a comprehensive range of
                            architectural services, tailored to meet the unique needs of our
                            clients. Our expertise spans across various sectors including:
                        </div>
                        <div>
                            {servicesData.map((data, index) => (
                                <motion.div
                                    key={index}
                                    className="flex flex-col border-b-2 hover:scale-[1.01] transition-all duration-500"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <div
                                        className="flex w-full justify-between items-center cursor-pointer h-20"
                                        onClick={() => handleServiceClick(index)}
                                    >
                                        <div className="sm:text-4xl text-3xl font-medium">
                                            {data.title}
                                        </div>
                                        <div className="text-xl text-[#656565]">
                                            {activeService === index ? (
                                                <AiOutlineMinus />
                                            ) : (
                                                <BsPlusLg />
                                            )}
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {activeService === index && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="text-[#807f7f] pb-7">
                                                    {data.description}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;