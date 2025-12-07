export const dynamic = 'force-dynamic'

import StatsCard from "@/features/projects/admin/components/StatsCard";
import Projects from "../../../features/projects/admin/components/Projects";
import UpdateProjectsSectionComponent from "@/features/projects/admin/components/UpdateProjectsSection";
import { fetchProjectsSection } from "@/app/actions/projects-section";

export default async function PortfolioPage() {
    const sectionData = await fetchProjectsSection();

    return (
        <div className="min-h-screen py-2">
            <div className="w-full sm:px-2 px-0">
                <div className=" mb-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="sm:text-3xl text-2xl  font-bold">Portfolio Management</h1>
                            <p className="sm:mt-2 mt-1">
                                Create and manage your construction projects portfolio
                            </p>
                        </div>
                    </div>
                    {/* Stats */}
                    <StatsCard />
                </div>

                {/* Section Header Editor */}
                <div className="mb-6">
                    <UpdateProjectsSectionComponent data={sectionData.data} />
                </div>

                {/* Projects showcase with search and filtering */}
                <Projects />
            </div>
        </div>
    );
}
