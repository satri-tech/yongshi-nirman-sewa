import { fetchProjects } from "@/app/actions/fetchProjects"
import ProjectCard from "./components/ProjectCard";

export default async function Projects() {
    const response = await fetchProjects()
    const projects = response.data;
    if (!response.success) {
        return <div>Error displaying Projects</div>
    }
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
            return <ProjectCard project={project} key={project.id} />
        })}
    </div>
}