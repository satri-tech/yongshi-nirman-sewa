"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Search,
    Filter,
    Calendar,
    MapPin,
    User,
    Square,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit,
    Trash2,
    MoreHorizontal
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Image from "next/image";
import {
    fetchProjects,
    fetchProjectStats,
    IProject,
    IPaginationParams
} from "@/app/actions/fetchProjects";

interface ProjectsDisplayProps {
    initialProjects?: IProject[];
    showStats?: boolean;
    showFilters?: boolean;
    showPagination?: boolean;
    itemsPerPage?: number;
}

export default function ProjectsDisplay({
    initialProjects = [],
    showStats = true,
    showFilters = true,
    showPagination = true,
    itemsPerPage = 12,
}: ProjectsDisplayProps) {
    const [projects, setProjects] = useState<IProject[]>(initialProjects);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);

    // Filter and pagination state
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [sortBy, setSortBy] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<string>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch projects function
    const loadProjects = useCallback(async (params: IPaginationParams = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchProjects({
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery,
                status: statusFilter as any,
                sortBy: sortBy as any,
                sortOrder: sortOrder as any,
                ...params,
            });

            if (response.success) {
                setProjects(response.data);
                setTotalPages(response.pagination.totalPages);
                setTotalCount(response.pagination.totalCount);
            } else {
                setError(response.error || "Failed to load projects");
                toast.error("Failed to load projects", {
                    description: response.error,
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            toast.error("Error loading projects", {
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchQuery, statusFilter, sortBy, sortOrder]);

    // Load statistics
    const loadStats = useCallback(async () => {
        try {
            const response = await fetchProjectStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error("Failed to load stats:", err);
        }
    }, []);

    // Initial load
    useEffect(() => {
        if (initialProjects.length === 0) {
            loadProjects();
        }
        if (showStats) {
            loadStats();
        }
    }, [loadProjects, loadStats, showStats, initialProjects.length]);

    // Reload projects when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1);
            loadProjects({ page: 1 });
        }, 500); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchQuery, statusFilter, sortBy, sortOrder]);

    // Handle pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        loadProjects({ page });
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800 hover:bg-green-200";
            case "InProgress":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200";
            case "Pending":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
            case "OnHold":
                return "bg-red-100 text-red-800 hover:bg-red-200";
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200";
        }
    };

    // Format date
    const formatDate = (date: Date | null) => {
        if (!date) return "Not set";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            {showStats && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Projects
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                In Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Area
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="text-2xl font-bold">{stats.totalArea.toLocaleString()} sq ft</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            {showFilters && (
                <Card className="p-4">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Status</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="InProgress">In Progress</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="OnHold">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                            const [field, order] = value.split("-");
                            setSortBy(field);
                            setSortOrder(order);
                        }}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                                <SelectItem value="title-asc">Title A-Z</SelectItem>
                                <SelectItem value="title-desc">Title Z-A</SelectItem>
                                <SelectItem value="status-asc">Status A-Z</SelectItem>
                                <SelectItem value="startDate-desc">Start Date (Recent)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card>
            )}

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader>
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-32 w-full mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <Card className="p-8 text-center">
                    <div className="text-red-500 mb-2">Error Loading Projects</div>
                    <div className="text-muted-foreground mb-4">{error}</div>
                    <Button onClick={() => loadProjects()} variant="outline">
                        Try Again
                    </Button>
                </Card>
            )}

            {/* Projects Grid */}
            {!loading && !error && projects.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                                            <Badge className={getStatusColor(project.status)}>
                                                {project.status === "InProgress" ? "In Progress" : project.status}
                                            </Badge>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Project
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Project Image */}
                                    {project.images && project.images.length > 0 && (
                                        <div className="aspect-video relative overflow-hidden rounded-md bg-muted">
                                            <Image
                                                src={project.images[0]}
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            {project.images.length > 1 && (
                                                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                                    +{project.images.length - 1} more
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Project Description */}
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {project.description}
                                    </p>

                                    {/* Project Details */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-muted-foreground">
                                            <User className="h-4 w-4 mr-2" />
                                            <span className="truncate">{project.client || "No client"}</span>
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span className="truncate">{project.location}</span>
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <Square className="h-4 w-4 mr-2" />
                                            <span>{project.area} sq ft</span>
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {showPagination && totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {projects.length} of {totalCount} projects
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!loading && !error && projects.length === 0 && (
                <Card className="p-8 text-center">
                    <div className="text-muted-foreground mb-2">No projects found</div>
                    <div className="text-sm text-muted-foreground">
                        {searchQuery || statusFilter !== "All"
                            ? "Try adjusting your filters or search query"
                            : "Create your first project to get started"
                        }
                    </div>
                </Card>
            )}
        </div>
    );
}