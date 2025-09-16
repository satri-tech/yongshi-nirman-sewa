'use client'
import { ITeamMember } from "@/app/actions/teamMembers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import DeleteTeamMember from "./DeleteTeamMember";
import EditTeamMember from "./EditTeamMember";

interface ITeamMembersTableProps {
    teamMembers?: ITeamMember[]
}
export default function TeamMembersTable({ teamMembers }: ITeamMembersTableProps) {
    return <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Facebook Url</TableHead>
                    <TableHead>Display Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {teamMembers?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                            No Team Members found
                        </TableCell>
                    </TableRow>
                ) : (
                    teamMembers?.map((teamMember) => (
                        <TableRow key={teamMember.id}>
                            <TableCell>
                                <Image
                                    height={48}
                                    width={48}
                                    src={`/api/images/teamMembers/${teamMember.image}`}
                                    alt={teamMember.name}
                                    className="h-12 w-12 object-cover rounded-full border"
                                    onError={(e) => {
                                        // Fallback to a default image if the API fails
                                        e.currentTarget.src = '/images/default-avatar.png';
                                    }}
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    {teamMember.name}
                                </div>
                            </TableCell>
                            <TableCell>{teamMember.position}</TableCell>
                            <TableCell>
                                {teamMember.facebookurl}
                            </TableCell>
                            <TableCell>
                                {teamMember.displayOrder}
                            </TableCell>
                            <TableCell className=" flex gap-2 justify-end">
                                <EditTeamMember teamMember={teamMember} />
                                <DeleteTeamMember teamMember={teamMember} />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </div>
}