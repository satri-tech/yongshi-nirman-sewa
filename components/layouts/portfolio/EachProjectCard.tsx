import Image from "next/image";
import { IProject } from "./types";
import Link from "next/link";

const EachProjectCard = ({ project }: { project: IProject }) => {
    return (
        <Link href={`/portfolio/1`} className="flex gap-1 flex-col w-full font-Poppins cursor-pointer opacity-95 hover:opacity-100 hover:scale-[1.01] transition-all">
            <Image
                height={1500}
                width={1500}
                src={project.image}
                alt=""
                className="h-[25rem] w-full rounded-md object-cover"
            />
            <div className="text-base font-medium tracking-wide pt-1">
                {project.name}
            </div>
            <div className="text-sm font-normal tracking-wide text-[#3b3b3b]">
                {project.location}
            </div>
        </Link>
    );
};

export default EachProjectCard;