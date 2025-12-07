"use client";
import EachProjectCard from "./EachProjectCard";
import HeaderTitle from "@/features/shared/components/HeaderTitle";
import { AnimatedArrow, AnimatedButton } from "@/features/animations/components/animated-component";
import { ArrowRight, FolderOpen } from "lucide-react";
import Link from "next/link";
import { fadeInDown } from "@/features/shared/hooks/use-scroll-animation";
import { IProject } from "@/app/actions/fetchProjects";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/features/shared/components/breadcrumb";
import { usePathname } from "next/navigation";

interface PortfolioComponentProps {
    projectsdata?: IProject[]
    showExploreMoreButton?: boolean;
    showTopBorder?: boolean;
    sectionTitle?: string;
    sectionSubtitle?: string;
}

const PortfolioComponent = ({
    projectsdata,
    showExploreMoreButton = true,
    showTopBorder = true,
    sectionTitle = "Projects",
    sectionSubtitle = "Let's dive into our Journey!",
}: PortfolioComponentProps) => {
    const pathname = usePathname()
    const isEmpty = !projectsdata || projectsdata.length === 0;

    return (
        <div
            id="projects"
            className={`flex lg:flex-row   flex-col justify-center items-center w-full h-max font-Poppins ${showTopBorder ? "border-t border-border sm:mt-24 mt-10 sm:pt-16 pt-8" : "mt-0 sm:pt-2 mb-20"
                }`}
        >
            <div className="font-Poppins flex flex-col lg:w-[92%] w-[90%] ">
                <div className="flex w-full sm:gap-6 gap-4 flex-col">
                    {pathname === "/projects" ?
                        <Breadcrumb className="mr-auto font-medium ">
                            <BreadcrumbList>
                                <BreadcrumbItem className="dark:text-white text-neutral-800 hover:underline">
                                    <Link href="/">Home</Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink >
                                        Projects
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        :
                        <>
                            <AnimatedButton variants={fadeInDown}>
                                <HeaderTitle header={sectionTitle} />
                            </AnimatedButton>
                            <AnimatedButton variants={fadeInDown}>
                                <div className="w-full flex">
                                    <div className="w-full sm:text-5xl text-3xl sm:font-medium font-medium  sm:leading-[4.4rem] leading-10 tracking-tight text-foreground">
                                        {isEmpty ? `${sectionTitle} Coming Soon!` : sectionSubtitle}
                                    </div>
                                </div>
                            </AnimatedButton>
                        </>
                    }


                    {isEmpty ? (
                        // Empty State UI
                        <div className="w-full flex flex-col items-center justify-center py-16 px-4 border border-dotted rounded">
                            <div className="flex flex-col items-center text-center space-y-6 max-w-md">
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                                    <FolderOpen className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-foreground">
                                        No Projects Yet
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        We&apos;re currently working on some amazing projects.
                                        Check back soon to see our latest work and creative endeavors.
                                    </p>
                                </div>
                                <div className="w-full h-px bg-border"></div>
                                <p className="text-xs text-muted-foreground">
                                    Stay tuned for updates
                                </p>
                            </div>
                        </div>
                    ) : (
                        // Projects Grid
                        <>
                            <div className="w-full grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-x-8 sm:gap-y-16 gap-y-12 justify-items-center">
                                {projectsdata?.map((data) => (
                                    <EachProjectCard key={data.id} project={data} />
                                ))}
                            </div>
                            {showExploreMoreButton && (
                                <Link
                                    href={"/projects"}
                                    className="h-12 ml-auto w-44 text-sm flex justify-center items-center bg-primary text-primary-foreground rounded-full cursor-pointer px-1 gap-2 hover:scale-105 transition-transform duration-500 hover:bg-primary/90"
                                >
                                    <div>Explore More</div>
                                    <AnimatedArrow className="text-2xl">
                                        <ArrowRight size={17} />
                                    </AnimatedArrow>
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PortfolioComponent;