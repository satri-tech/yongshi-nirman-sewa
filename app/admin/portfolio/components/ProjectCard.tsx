import { Calendar, Grid, MapPin } from "lucide-react";
import ImageGallery from "./ImageGallery";
import StatusBadge from "./StatusBadge";
import DeleteProject from "./DeleteProject";
import EditProject from "./EditProject";
import { IProject } from "@/app/actions/fetchProjects";
interface IProjectCard {
    project: IProject
}

export default function ProjectCard({ project }: IProjectCard) {

    // Format date
    const formatDate = (date: Date | null) => {
        if (!date) return "Not set";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return <div key={project.id} className="rounded-xl h-max border hover:shadow-md transition-shadow duration-200">
        {/* Project Image */}
        <ImageGallery images={project.images} projectTitle={project.title} />

        {/* Project Content */}
        <div className="p-6">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{project.title}</h3>
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>


            {/* Project Details */}
            <div className="space-y-2 mb-4">
                <div className="flex gap-3">
                    <StatusBadge status={project.status} />
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{project.client}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Grid className="w-4 h-4" />
                    <span>{project.area} Sq Ft.</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}  </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 p-2 rounded border w-full">
                <EditProject project={project} />
                <DeleteProject variant="both" project={project} />
            </div>

        </div>
    </div>
}