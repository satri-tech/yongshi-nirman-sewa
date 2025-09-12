import Image from "next/image";
import Link from "next/link";
import { AnimatedImageContainer } from "@/components/animations/animated-component";
import { staggerItem } from "@/hooks/use-scroll-animation";
import { IProject } from "@/app/actions/fetchProjects";


const EachProjectCard = ({ project }: { project: IProject }) => {
    return (
        <AnimatedImageContainer variants={staggerItem} className="w-full">
            <Link href={`/portfolio/${project.id}`} className="relative group overflow-hidden cursor-pointer w-full">
                {/* <AnimatedCursor iconColor="#9929EA" iconFill="#9929EA"  tooltipClassName="bg-[#9929EA]" /> */}
                <Image className="h-[19rem] w-full cursor-pointer rounded-md object-cover object-top  transition-all duration-500  group-hover:h-72 group-hover:rounded-xl"
                    src={`/api/images/projects/${project.images[0]}`}
                    alt="team member" width="826" height="1239" />
                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                    <div className="flex justify-between">
                        <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">{project.title}</h3>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                        <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{project.location}</span>
                    </div>
                </div>
            </Link>
        </AnimatedImageContainer>
    );
};

export default EachProjectCard;

