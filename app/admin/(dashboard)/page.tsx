export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/components/card";
import { Badge } from "@/features/shared/components/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/shared/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/shared/components/tabs";
import { Alert, AlertDescription } from "@/features/shared/components/alert";
import {
    FolderKanban,
    MessageSquare,
    Star,
    UserCheck,
    BarChart3,
    PieChart,
} from "lucide-react";
import { fetchDashboardAnalytics } from "@/app/actions/fetchDashboardAnalytics";
import { format } from "date-fns";
import StatsCard from "./StatsCard";
import { RefreshButton } from "./RefreshButton";
import Image from "next/image";
import { ChartPieDonut } from "./PieChart";
import { BarChartComponent } from "./BarChart";
import { DashboardData } from "./types";
import { calculateGrowthPercentage, getGrowthColor, getGrowthIcon, getStatusVariant } from "./utils";


export default async function AdminPage() {
    // Fetch data on the server
    const result = await fetchDashboardAnalytics();

    if (!result.success) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h2>
                    <RefreshButton />
                </div>
                <Alert>
                    <AlertDescription>{result.message || 'Failed to fetch dashboard data'}</AlertDescription>
                </Alert>
            </div>
        );
    }

    const data = result.data as DashboardData;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h2>
                <RefreshButton />
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Projects"
                    value={data?.overview.totalProjects || 0}
                    icon={<FolderKanban className="h-4 w-4" />}
                    description={`${data?.projects.statusCounts.Completed || 0} completed`}
                    growth={
                        <div className="flex items-center space-x-1">
                            {getGrowthIcon(data?.projects.growth.last30Days || 0, data?.projects.growth.previous30Days || 0)}
                            <span className={getGrowthColor(data?.projects.growth.last30Days || 0, data?.projects.growth.previous30Days || 0)}>
                                {calculateGrowthPercentage(data?.projects.growth.last30Days || 0, data?.projects.growth.previous30Days || 0)}%
                            </span>
                        </div>
                    }
                />

                <StatsCard
                    title="Contact Messages"
                    value={data?.overview.totalContacts || 0}
                    icon={<MessageSquare className="h-4 w-4" />}
                    description="Total inquiries"
                    growth={
                        <div className="flex items-center space-x-1">
                            {getGrowthIcon(data?.contacts.growth.last30Days || 0, data?.contacts.growth.previous30Days || 0)}
                            <span className={getGrowthColor(data?.contacts.growth.last30Days || 0, data?.contacts.growth.previous30Days || 0)}>
                                {calculateGrowthPercentage(data?.contacts.growth.last30Days || 0, data?.contacts.growth.previous30Days || 0)}%
                            </span>
                        </div>
                    }
                />

                <StatsCard
                    title="Team Members"
                    value={data?.overview.activeTeamMembers || 0}
                    icon={<UserCheck className="h-4 w-4" />}
                    description={`${data?.team.total || 0} total members`}
                />

                <StatsCard
                    title="Testimonials"
                    value={data?.overview.totalTestimonials || 0}
                    icon={<Star className="h-4 w-4" />}
                    description={`${data?.overview.averageRating || 0}★ avg rating`}
                />

                <StatsCard
                    title="Project Completed"
                    value={`${data?.projects.statusCounts.Completed && data?.overview.totalProjects
                        ? ((data.projects.statusCounts.Completed / data.overview.totalProjects) * 100).toFixed(1)
                        : 0}%`}
                    icon={<BarChart3 className="h-4 w-4" />}
                    description="completed"
                />
            </div>

            {/* Charts and Analytics */}
            <Tabs defaultValue="projects" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="contacts">Contacts</TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Project Status Pie Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <PieChart className="h-5 w-5" />
                                    <span>Project Status Distribution</span>
                                </CardTitle>
                                <CardDescription>Distribution of projects by status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartPieDonut data={[
                                    { name: 'Completed', data: data?.projects.statusCounts.Completed || 0 },
                                    { name: 'In Progress', data: data?.projects.statusCounts.InProgress || 0 },
                                    { name: 'On Hold', data: data?.projects.statusCounts.OnHold || 0 },
                                    { name: 'Pending', data: data?.projects.statusCounts.Pending || 0 },
                                ]} />
                            </CardContent>
                        </Card>

                        <BarChartComponent
                            title="Project Status Count"
                            description="Number of projects in each status"
                            showFooter={false}
                            activeIndex={0}
                            data={[
                                { name: 'Completed', value: data?.projects.statusCounts.Completed || 0, fill: "var(--chart-1)", label: "Completed" },
                                { name: 'In Progress', value: data?.projects.statusCounts.InProgress || 0, fill: "var(--chart-2)", },
                                { name: 'On Hold', value: data?.projects.statusCounts.OnHold || 0, fill: "var(--chart-3)", },
                                { name: 'Pending', value: data?.projects.statusCounts.Pending || 0, fill: "var(--chart-4)", },
                            ]} />
                    </div>

                    {/* Recent Projects Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Projects</CardTitle>
                            <CardDescription>Latest 5 projects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Area</TableHead>

                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.projects.recentProjects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>
                                                <Image alt="project image"
                                                    src={`/api/images/projects/${project.images[0]}`}
                                                    height={100}
                                                    width={100}
                                                    className="h-12 w-12 rounded-sm" />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {project.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(project.status)}>
                                                    {project.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{project.client}</TableCell>
                                            <TableCell>{project.location}</TableCell>
                                            <TableCell>{project.area} Sq Ft.</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </TabsContent>

                <TabsContent value="contacts" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-1">


                        {/* can add more charts here based on the data.contacts */}

                        {/* Recent Contact Messages Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Contact Messages</CardTitle>
                                <CardDescription>Latest inquiries from clients</CardDescription>
                            </CardHeader>
                            <CardContent>

                                {
                                    data.contacts.total === 0 ? <div>
                                        No contacts Available
                                    </div> :

                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Message</TableHead>
                                                    <TableHead>Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data?.contacts.recentContacts.map((contact) => (
                                                    <TableRow key={contact.id}>
                                                        <TableCell className="font-medium">
                                                            {contact.fullName}
                                                        </TableCell>
                                                        <TableCell>{contact.email}</TableCell>
                                                        <TableCell className="max-w-xs truncate">
                                                            {contact.message}
                                                        </TableCell>
                                                        <TableCell>
                                                            {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                }
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
}