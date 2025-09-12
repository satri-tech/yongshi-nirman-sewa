import { fetchProjects } from "@/app/actions/fetchProjects";
import PortfolioComponent from "@/components/layouts/portfolio/Portfolio";
export const revalidate = 3600;

export default async function Portfolios() {
    const response = await fetchProjects(); // fetch server-side
    const projectsdata = response.data;
    return <div className=" flex flex-col gap-2 items-center">
        <PortfolioComponent showExploreMoreButton={false} showTopBorder={false} projectsdata={projectsdata} />
    </div>
}