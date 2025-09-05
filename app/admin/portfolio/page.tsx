"use client"
import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, MapPin, DollarSign, Building, SquareArrowOutUpRight, Users, Award, Clock, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StatsCard from "./StatsCard";
import ActionsComponent from "./ActionsComponent";
import { RiMoneyRupeeCircleFill } from 'react-icons/ri'
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";
import ImageGallery from "./ImageGallery";

export default function PortfolioPage() {
    // Enhanced projects data with additional badge-worthy properties
    const [projects] = useState([
        {
            id: 1,
            title: "Modern Office Complex",
            description: "A state-of-the-art 15-story office building with sustainable features and modern amenities.",
            images: [
                { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Main building exterior" },
                { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Modern lobby interior" },
                { url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Office workspace" },
                { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Rooftop terrace" }
            ], status: "Completed",
            location: "Downtown District",
            completionDate: "March 2024",
            budget: "2.5M",
            category: "Commercial"
        },
        {
            id: 2,
            title: "Luxury Residential Villa",
            description: "Custom-built luxury villa featuring contemporary design with premium finishes and landscaping.",
            images: [
                { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Main building exterior" },
                { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Modern lobby interior" },
                { url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Office workspace" },
                { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Rooftop terrace" }
            ], status: "Completed",
            location: "Hillside Heights",
            completionDate: "January 2024",
            budget: "1.8M",
            category: "Residential"
        },
        {
            id: 3,
            title: "Shopping Mall Renovation",
            description: "Complete renovation and modernization of existing shopping center including new facades and interior spaces.",
            images: [
                { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Main building exterior" },
                { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Modern lobby interior" },
                { url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Office workspace" },
                { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Rooftop terrace" }
            ], status: "In Progress",
            location: "City Center",
            completionDate: "Expected Dec 2024",
            budget: "3.2M",
            category: "Renovation"
        },
        {
            id: 4,
            title: "Industrial Warehouse",
            description: "Large-scale warehouse facility with advanced logistics systems and energy-efficient design.",
            images: [
                { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Main building exterior" },
                { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Modern lobby interior" },
                { url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Office workspace" },
                { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Rooftop terrace" }
            ], status: "Completed",
            location: "Industrial Zone",
            completionDate: "October 2023",
            budget: "4.1M",
            category: "Industrial"
        },
        {
            id: 5,
            title: "Community Hospital Wing",
            description: "New pediatric wing addition to existing hospital with specialized medical facilities and patient-centered design.",
            images: [
                { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Main building exterior" },
                { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Modern lobby interior" },
                { url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Office workspace" },
                { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Rooftop terrace" }
            ], status: "In Progress",
            location: "Medical District",
            completionDate: "Expected Feb 2025",
            budget: "5.7M",
            category: "Healthcare"
        },
        {
            id: 6,
            title: "Sustainable Housing Development",
            description: "Eco-friendly housing complex with solar panels, rainwater harvesting, and green building materials.",
            images: [
                { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Main building exterior" },
                { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Modern lobby interior" },
                { url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Office workspace" },
                { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80", caption: "Rooftop terrace" }
            ], status: "Planning",
            location: "Green Valley",
            completionDate: "Expected June 2025",
            budget: "6.8M",
            category: "Residential"
        }
    ]);



    return (
        <div className="min-h-screen py-2">
            <div className="w-full">
                <div className="px-6 py-8 mb-8">
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
                    <StatsCard projects={projects} />
                </div>

                {/* Filters */}
                <ActionsComponent />

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="rounded-xl border hover:shadow-md transition-shadow duration-200">
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
                                        <CategoryBadge category={project.category} />


                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>{project.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>{project.completionDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <RiMoneyRupeeCircleFill className="w-4 h-4" />
                                        <span>{project.budget}</span>
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
                    ))}
                </div>

                {/* Empty State (when no projects) */}
                {projects.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                        <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                        <p className="text-gray-600 mb-6">Get started by adding your first construction project to showcase your work.</p>
                        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            <Plus className="w-5 h-5" />
                            Add First Project
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
