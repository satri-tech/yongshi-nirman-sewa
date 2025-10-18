export const dynamic = 'force-dynamic'

import { Badge } from "@/features/shared/components/badge";
import { Card, CardContent } from "@/features/shared/components/card";
import { fetchTeamMembers } from "@/app/actions/teamMembers";
import AddTeamMember from "@/features/team/admin/components/AddTeamMember";
import TeamMembersTable from "@/features/team/admin/components/TeamMembersTable";

export default async function TeamPage() {
    const response = await fetchTeamMembers();
    const teamMembers = response.data || []; // Provide empty array fallback

    return (
        <div className="min-h-screen py-2">
            <div className="w-full sm:px-2">
                <div className=" mb-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="sm:text-3xl text-2xl font-bold">Team Management</h1>
                            <p className="sm:mt-2 mt-1">
                                Add, edit, and organize your company&apos;s team members. These details will be
                                displayed on the website to showcase your staff and their roles.
                            </p>
                        </div>
                    </div>
                </div>
                <Card>
                    <CardContent>
                        <div className="mb-4 flex items-center justify-between">
                            <Badge variant="outline" className="text-sm">
                                Total Members: {teamMembers.length}
                            </Badge>
                            <div className="flex items-center gap-2">
                                <AddTeamMember />
                            </div>
                        </div>
                        <TeamMembersTable teamMembers={teamMembers} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
