'use client'

import { Input } from '@/components/ui/input'
import React, { useState, useMemo } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import CreatePortfolio from '../CreatePortfolio'
import ProjectCard from './ProjectCard'
import { IProject } from '@/app/actions/fetchProjects'


interface SearchFilterComponentProps {
    projects: IProject[]
}

const SearchFilterComponent = ({ projects }: SearchFilterComponentProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('All')

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            // Search filter
            const matchesSearch =
                searchTerm === '' ||
                (project.title || '').toLowerCase().includes(searchTerm.toLowerCase())

            // Status filter
            const matchesStatus =
                statusFilter === 'All' || statusFilter === '' || project.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [projects, searchTerm, statusFilter])

    return (
        <>
            <div className="rounded-lg shadow-sm border p-3 mb-6">
                <div className="flex gap-4 justify-between">
                    <Input
                        type="text"
                        placeholder="Search projects..."
                        className="rounded-md px-3 py-5 text-base placeholder:text-base w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className='flex gap-4'>
                        <Select value={statusFilter} onValueChange={setStatusFilter} defaultValue='All'>
                            <SelectTrigger className="w-[180px] py-5">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="InProgress">In Progress</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="OnHold">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                        <CreatePortfolio />
                    </div>
                </div>
            </div>

            {/* Display filtered projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => {
                        return <ProjectCard project={project} key={project.id} />
                    })
                ) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                        No projects found matching your criteria.
                    </div>
                )}
            </div>
        </>
    )
}

export default SearchFilterComponent