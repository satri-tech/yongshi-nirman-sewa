import { Building } from 'lucide-react'
import React from 'react'
import { RiMoneyRupeeCircleFill } from 'react-icons/ri'

const StatsCard = ({ projects }: any) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className=" border rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Total Projects</p>
                        <p className="text-2xl font-bold">{projects.length}</p>
                    </div>
                </div>
            </div>
            <div className=" border rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-2xl font-bold">
                            {projects.filter(p => p.status === "Completed").length}
                        </p>
                    </div>
                </div>
            </div>

            <div className=" border rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">In Progress</p>
                        <p className="text-2xl font-bold">
                            {projects.filter(p => p.status === "In Progress").length}
                        </p>
                    </div>
                </div>
            </div>

            <div className=" border rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <RiMoneyRupeeCircleFill className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Total Value</p>
                        <p className="text-2xl font-bold">
                            44 Lakhs
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatsCard
