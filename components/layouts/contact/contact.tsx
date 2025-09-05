
import { AnimatedButton, AnimatedTitle, AnimationWrapper } from '@/components/animations/animated-component';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card';
import HeaderTitle from '@/components/ui/HeaderTitle'
import Map from '@/components/ui/Map'
import { fadeInDown, fadeInLeft, staggerItem } from '@/hooks/use-scroll-animation';
import { SendHorizontal, MapPin, Phone, Mail } from 'lucide-react'
import { BsGithub, BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs';
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
export default function Contact() {
    return (
        <div id="contact"
            className={`flex lg:flex-row flex-col justify-center items-center w-full mt-24 h-max border-t-[0.1px] font-Poppins sm:pt-16 pt-8`}
        >
            <div className="font-Poppins flex flex-col  lg:w-[92%] w-[90%] ">
                <div className="flex w-full sm:gap-6 gap-4 flex-col ">
                    <AnimatedButton variants={fadeInDown}>
                        <HeaderTitle header={"Contact"} />
                    </AnimatedButton>
                    <AnimatedTitle variants={fadeInLeft}>
                        <div className="w-full flex">
                            <div className="w-full sm:text-5xl text-3xl font-medium leading-[4.4rem] tracking-tight">
                                Any question? We would be happy to help you!
                            </div>
                        </div>

                    </AnimatedTitle>
                    <div className='flex pt-10 flex-col lg:flex-row gap-8'>
                        {/* Contact Form */}
                        <AnimationWrapper className='w-full lg:w-8/12' variants={staggerItem}>
                            <Card className="flex flex-col p-6  rounded-lg gap-2 w-full  font-Poppins">
                                <h3 className="text-xl  font-semibold mb-4 border-b pb-4">Get in Touch</h3>
                                <div className="flex flex-col md:flex-row text-xs justify-between gap-4 ">
                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            className="placeholder:text-xs text-xs w-full border-2 h-12 rounded-md focus:outline-none pl-4 font-Poppins font-normal tracking-wide"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="">Your Email</label>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="placeholder:text-xs w-full border-2 h-12 rounded-md focus:outline-none pl-4 text-xs font-Poppins font-normal tracking-wide"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 w-full text-xs">
                                    <label htmlFor="">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="Your Phone Number"
                                        className="placeholder:text-xs w-full border-2 h-12 rounded-md focus:outline-none pl-4 text-xs font-Poppins font-normal tracking-wide"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 w-full text-xs">
                                    <label htmlFor="">MESSAGE</label>
                                    <textarea
                                        placeholder="Write some message for us"
                                        className="placeholder:text-xs w-full border-2 focus:outline-none p-4 text-xs font-Poppins tracking-wide font-normal rounded-md h-32"
                                    />
                                </div>
                                <Button className='py-5 ml-auto rounded-sm px-8'>Send <SendHorizontal /></Button>
                            </Card>
                        </AnimationWrapper>


                        <div className="w-full lg:w-1/2 space-y-6">

                            <AnimationWrapper >
                                <div className="dark:bg-gray-800 rounded-lg p-4 border">
                                    <h3 className="text-xl font-semibold mb-6 border-b pb-2">Contact Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="text-gray-600 w-5 h-5" />
                                            <div>
                                                <p className="font-medium">Address</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">Shishuwa, Pokhara, Nepal</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="text-gray-600 w-5 h-5" />
                                            <div>
                                                <p className="font-medium">Phone</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">+977 123 456 7890</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="text-gray-600 w-5 h-5" />
                                            <div>
                                                <p className="font-medium">Email</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">info@yongshi-nirman.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimationWrapper>

                            <AnimationWrapper >
                                <div className="dark:bg-gray-800 rounded-lg p-4 border">
                                    <h3 className="text-xl font-semibold mb-6 border-b pb-2">Follow Us</h3>

                                    <div className="flex flex-wrap gap-4">
                                        {/* Facebook */}
                                        <Button
                                            size={'icon'}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                        >
                                            <FaFacebookF size={20} />
                                        </Button>

                                        {/* Twitter/X */}
                                        <Button
                                            size={'icon'}
                                            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-200"
                                        >
                                            <BsTwitter size={20} />
                                        </Button>

                                        {/* Instagram */}
                                        <Button
                                            size={'icon'}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200"
                                        >
                                            <BsInstagram size={20} />
                                        </Button>

                                        {/* YouTube */}
                                        <Button
                                            size={'icon'}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                                        >
                                            <BsYoutube size={20} />
                                        </Button>

                                        {/* LinkedIn */}
                                        <Button
                                            size={'icon'}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white transition-colors duration-200"
                                        >
                                            <FaLinkedinIn size={20} />
                                        </Button>

                                        {/* GitHub */}
                                        <Button
                                            size={'icon'}
                                        >
                                            <BsGithub size={20} />
                                        </Button>
                                    </div>
                                </div>
                            </AnimationWrapper>



                        </div>
                        <AnimatedTitle>
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Find Us Here</h3>
                                <Map className="w-full" />
                            </div>
                        </AnimatedTitle>
                    </div>
                </div>
            </div>
        </div>
    )
}