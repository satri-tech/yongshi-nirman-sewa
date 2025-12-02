import { fetchProjects } from "@/app/actions/fetchProjects";
import { fetchProjectsSection } from "@/app/actions/projects-section";
import PortfolioComponent from "@/features/projects/client/components/Portfolio";
export const revalidate = 3600;

export default async function Portfolios() {
    const [projectsResponse, sectionResponse] = await Promise.all([
        fetchProjects(),
        fetchProjectsSection()
    ]);
    
    return <div className=" flex flex-col gap-2 items-center">
        <PortfolioComponent 
            showExploreMoreButton={false} 
            showTopBorder={false} 
            projectsdata={projectsResponse.data}
            sectionTitle={sectionResponse.data?.title}
            sectionSubtitle={sectionResponse.data?.subtitle}
        />
    </div>
}