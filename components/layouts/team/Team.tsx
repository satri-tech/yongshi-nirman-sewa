import HeaderTitle from '@/components/ui/HeaderTitle'
import Image from 'next/image'
import Link from 'next/link'
import Member1 from '@/public/team/member1.jpg'
import { AnimatedButton, AnimatedImageContainer, AnimatedTitle } from '@/components/animations/animated-component'
import { fadeInDown, staggerItem } from '@/hooks/use-scroll-animation'
const members = [
    {
        name: 'Liam Brown',
        role: 'Founder - CEO',
        avatar: Member1,
        link: '#',
    },
    {
        name: 'Elijah Jones',
        role: 'Co-Founder - CTO',
        avatar: Member1,
        link: '#',
    },
    {
        name: 'Isabella Garcia',
        role: 'Sales Manager',
        avatar: Member1,
        link: '#',
    },
    {
        name: 'Henry Lee',
        role: 'UX Engeneer',
        avatar: Member1,
        link: '#',
    },

]

export default function Team() {
    return (
        <div id="team"
            className={`flex lg:flex-row flex-col justify-center items-center w-full mt-24 h-max border-t-[0.1px] font-Poppins sm:pt-16 pt-8`}
        >
            <div className="font-Poppins flex flex-col  lg:w-[92%] w-[90%] ">
                <div className="flex w-full sm:gap-6 gap-4 flex-col ">
                    <AnimatedButton variants={fadeInDown}>
                        <HeaderTitle header={"Team"} />
                    </AnimatedButton>
                    <AnimatedTitle variants={fadeInDown}>
                        <div className="w-full flex">
                            <div className="w-full sm:text-5xl text-3xl font-medium leading-[4.4rem] tracking-tight">
                                Bringing passion and Expertise together!
                            </div>
                        </div>
                    </AnimatedTitle>
                    <div className="mt-6 md:mt-8">
                        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                            {members.map((member, index) => (
                                <AnimatedImageContainer variants={staggerItem}>
                                    <div key={index} className="group overflow-hidden cursor-pointer">
                                        <Image className="h-80 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-72 group-hover:rounded-xl" src={member.avatar} alt="team member" width="826" height="1239" />
                                        <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                                            <div className="flex justify-between">
                                                <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">{member.name}</h3>
                                                <span className="text-xs">_0{index + 1}</span>
                                            </div>
                                            <div className="mt-1 flex items-center justify-between">
                                                <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{member.role}</span>
                                                <Link href={member.link} className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100">
                                                    Facebook
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedImageContainer>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}