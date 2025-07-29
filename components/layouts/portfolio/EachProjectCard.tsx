import Image from "next/image";
import { IProject } from "./types";
import Link from "next/link";
import { AnimatedImageContainer } from "@/components/animations/animated-component";
import { fadeInDown, staggerItem } from "@/hooks/use-scroll-animation";

const EachProjectCard = ({ project }: { project: IProject }) => {
    return (
        <AnimatedImageContainer variants={staggerItem}>
            <Link href={`/portfolio/1`} className="group overflow-hidden cursor-pointer">
                <Image className="h-[19rem] w-full rounded-md object-cover object-top  transition-all duration-500  group-hover:h-72 group-hover:rounded-xl" src={project.image}
                    alt="team member" width="826" height="1239" />
                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                    <div className="flex justify-between">
                        <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">{project.name}</h3>
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

