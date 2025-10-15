export const dynamic = "force-dynamic"
import { fetchProjectStats } from '@/app/actions/fetchProjects'
import { Building, CheckCircle2, Grid, Loader2 } from 'lucide-react'
export default async function StatsCard() {
    const response = await fetchProjectStats();

    if (!response.success || !response.data) {
        return <div className="text-red-500">Failed to load project stats</div>;
    }
    const stats = response.data;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className=" border rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Total Projects</p>
                        <p className="text-2xl font-bold">{stats?.total}</p>
                    </div>
                </div>
            </div>
            <div className=" border rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-2xl font-bold">
                            {stats?.completed}
                        </p>
                    </div>
                </div>
            </div>

            <div className=" border rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">In Progress</p>
                        <p className="text-2xl font-bold">
                            {stats?.inProgress}
                        </p>
                    </div>
                </div>
            </div>

            <div className=" border rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Grid className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Total Area</p>
                        <p className="text-2xl font-bold">
                            {stats.totalArea} <span className='text-sm text-muted-foreground'>Sq Feet.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

