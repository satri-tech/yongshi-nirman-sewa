import { Button } from '@/components/ui/button'
import HeaderTitle from '@/components/ui/HeaderTitle'
import { SendHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const members = [
    {
        name: 'Liam Brown',
        role: 'Founder - CEO',
        avatar: 'https://alt.tailus.io/images/team/member-one.webp',
        link: '#',
    },
    {
        name: 'Elijah Jones',
        role: 'Co-Founder - CTO',
        avatar: 'https://alt.tailus.io/images/team/member-two.webp',
        link: '#',
    },
    {
        name: 'Isabella Garcia',
        role: 'Sales Manager',
        avatar: 'https://alt.tailus.io/images/team/member-three.webp',
        link: '#',
    },
    {
        name: 'Henry Lee',
        role: 'UX Engeneer',
        avatar: 'https://alt.tailus.io/images/team/member-four.webp',
        link: '#',
    },
    {
        name: 'Ava Williams',
        role: 'Interaction Designer',
        avatar: 'https://alt.tailus.io/images/team/member-five.webp',
        link: '#',
    },
    {
        name: 'Olivia Miller',
        role: 'Visual Designer',
        avatar: 'https://alt.tailus.io/images/team/member-six.webp',
        link: '#',
    },
]

export default function Contact() {
    return (
        <div id="contact"
            className={`flex lg:flex-row flex-col justify-center items-center w-full mt-24 h-max border-t-[0.1px] font-Poppins sm:pt-16 pt-8`}
        >
            <div className="font-Poppins flex flex-col  lg:w-[92%] w-[90%] ">
                <div className="flex w-full sm:gap-6 gap-4 flex-col ">
                    <HeaderTitle header={"Contact"} />
                    <div className="w-full flex">
                        <div className="w-full sm:text-5xl text-3xl font-medium leading-[4.4rem] tracking-tight">
                            Any question? We would be happy to help you!
                        </div>
                    </div>
                    <div className=' flex pt-10 '>
                        <div className='w-full'></div>

                        <div className="flex flex-col justify-center gap-6 w-full font-Poppins">
                            <div className="flex flex-col md:flex-row text-xs justify-between gap-4 ">
                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="placeholder:text-xs text-xs w-full border-2 h-12 rounded-md focus:outline-none pl-4 font-Poppins font-normal tracking-wide"

                                    />

                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="">Your Email</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your email"
                                        className="placeholder:text-xs w-full border-2 h-12 rounded-md focus:outline-none pl-4 text-xs font-Poppins font-normal tracking-wide"

                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 w-full text-xs">
                                <label htmlFor="">Phone Number</label>
                                <input
                                    type="text"
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}