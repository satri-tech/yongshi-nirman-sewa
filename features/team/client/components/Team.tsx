"use client"
import HeaderTitle from '@/features/shared/components/HeaderTitle'
import Image from 'next/image'
import { AnimatedButton, AnimatedImageContainer, AnimatedTitle } from '@/features/animations/components/animated-component'
import { fadeInDown, staggerItem } from '@/features/shared/hooks/use-scroll-animation'
import { ITeamMember } from '@/app/actions/teamMembers'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/features/shared/components/breadcrumb";
import Link from "next/link";
import { usePathname } from 'next/navigation'

interface ITeamProps {
    teamMembers?: ITeamMember[]
    showExploreMoreButton?: boolean;
    showTopBorder?: boolean;
}

export default function Team({ teamMembers, showExploreMoreButton = true, showTopBorder = true }: ITeamProps) {
    const pathname = usePathname()
    
    return (
        <div id="team"
            className={`flex lg:flex-row flex-col justify-center items-center w-full h-max font-Poppins ${showTopBorder ? "border-t border-border sm:mt-24 mt-10 sm:pt-16 pt-8" : "mt-0 sm:pt-2 mb-20"}`}
        >
            <div className="font-Poppins flex flex-col lg:w-[92%] w-[90%] ">
                <div className="flex w-full sm:gap-6 gap-4 flex-col">
                    {pathname === "/team" ?
                        <Breadcrumb className="mr-auto font-medium ">
                            <BreadcrumbList>
                                <BreadcrumbItem className="dark:text-white text-neutral-800 hover:underline">
                                    <Link href="/">Home</Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink>Team</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        :
                        <>
                            <AnimatedButton variants={fadeInDown}>
                                <HeaderTitle header={"Team"} />
                            </AnimatedButton>
                            <AnimatedTitle variants={fadeInDown}>
                                <div className="w-full flex">
                                    <div className="w-full sm:text-5xl text-3xl sm:font-medium font-medium  sm:leading-[4.4rem] leading-10 tracking-tight text-foreground">
                                        Bringing passion and Expertise together!
                                    </div>
                                </div>
                            </AnimatedTitle>
                        </>
                    }
                    <div className="mt-6 md:mt-8">
                        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                            {teamMembers?.map((teamMember, index) => (
                                <AnimatedImageContainer variants={staggerItem} key={index}>
                                    <div className="group overflow-hidden cursor-pointer">
                                        <Image className="h-80 w-full rounded-md object-cover object-top  transition-all duration-500  group-hover:h-72 group-hover:rounded-xl"
                                            src={`/api/images/teamMembers/${teamMember.image}`} alt="team member" width="826" height="1239" />
                                        <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">{teamMember.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{teamMember.position}</p>
                                                </div>
                                                <a href={teamMember.facebookurl ?? "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer" className="text-xs hover:underline">Facebook</a>
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