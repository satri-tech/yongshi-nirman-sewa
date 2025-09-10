import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge, Calendar, Edit, Eye, Grid, MapPin, MoreHorizontal, Square, SquareArrowOutUpRight, Trash2, User } from "lucide-react";
import Image from "next/image";
import ImageGallery from "./ImageGallery";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";

export default function ProjectCard({ project }) {
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

    return <div key={project.id} className="rounded-xl h-max border hover:shadow-md transition-shadow duration-200">
        {/* Project Image */}
        <ImageGallery images={project.images} projectTitle={project.title} />

        {/* Project Content */}
        <div className="p-6">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{project.title}</h3>
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>


            {/* Project Details */}
            <div className="space-y-2 mb-4">
                <div className="flex gap-3">
                    <StatusBadge status={project.status} />
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{project.client}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Grid className="w-4 h-4" />
                    <span>{project.area} Sq Ft.</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}  </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 p-2 rounded border w-full">
                <Button className="flex-1">
                    <SquareArrowOutUpRight className="w-4 h-4 mr-2" />
                    View Details
                </Button>
                <Button variant={'outline'} size={'icon'}>
                    <Edit className="w-4 h-4" />
                </Button>
                <Button variant={'secondary'} size={'icon'}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

        </div>
    </div>
}