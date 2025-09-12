import { fetchProjects } from "@/app/actions/fetchProjects"
import SearchFilterComponent from "./components/SearchFilterComponent";

export default async function Projects() {
    const response = await fetchProjects()
    const projects = response.data;
    if (!response.success) {
        return <div>Error displaying Projects</div>
    }
    return <>
        <SearchFilterComponent projects={projects} />
    </>
}