export const dynamic = 'force-dynamic'

import StatsCard from "./components/StatsCard";
import ActionsComponent from "./components/ActionsComponent";
import Projects from "./Projects";

export default function PortfolioPage() {
    return (
        <div className="min-h-screen py-2">
            <div className="w-full px-2">
                <div className=" mb-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Portfolio Management</h1>
                            <p className="mt-2">
                                Create and manage your construction projects portfolio
                            </p>
                        </div>
                    </div>
                    {/* Stats */}
                    <StatsCard />
                </div>

                {/* Filters */}
                <ActionsComponent />
                <Projects />
            </div>
        </div>
    );
}
