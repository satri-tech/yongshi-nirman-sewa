'use client'
import { ITeamMember } from "@/app/actions/teamMembers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/shared/components/table";
import Image from "next/image";
import DeleteTeamMember from "./DeleteTeamMember";
import EditTeamMember from "./EditTeamMember";
import { Button } from "@/features/shared/components/button";
import axios from 'axios'
import { toast } from "sonner";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ITeamMembersTableProps {
    teamMembers: ITeamMember[];
}

export default function TeamMembersTable({ teamMembers }: ITeamMembersTableProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    // Sort team members by displayOrder before rendering
    // Handle null displayOrder by treating null as highest value (moved to end)
    const sortedTeamMembers = [...teamMembers].sort((a, b) => {
        const aOrder = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
        const bOrder = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
    });

    const moveImage = async (memberId: string, direction: 'up' | 'down') => {
        if (isUpdating) return; // Prevent multiple simultaneous updates

        // Find the current member by ID
        const currentIndex = sortedTeamMembers.findIndex(member => member.id === memberId);

        // Check if move is valid
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === sortedTeamMembers.length - 1)
        ) {
            toast.warning("Cannot move further in this direction");
            return;
        }

        // Calculate target index
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        // Get both members
        const currentMember = sortedTeamMembers[currentIndex];
        const targetMember = sortedTeamMembers[targetIndex];

        // Handle null displayOrder values
        const currentDisplayOrder = currentMember.displayOrder ?? currentIndex + 1;
        const targetDisplayOrder = targetMember.displayOrder ?? targetIndex + 1;

        // If either member has null displayOrder, initialize display orders first
        if (currentMember.displayOrder === null || targetMember.displayOrder === null) {
            try {
                await initializeDisplayOrders();
                toast.info("Display orders initialized. Please try again.");
                return;
            } catch {
                toast.error("Failed to initialize display orders");
                return;
            }
        }

        console.log("Moving member:", {
            current: { id: currentMember.id, name: currentMember.name, displayOrder: currentDisplayOrder },
            target: { id: targetMember.id, name: targetMember.name, displayOrder: targetDisplayOrder },
            direction
        });

        setIsUpdating(true);

        try {
            // Swap the display orders
            await Promise.all([
                axios.put(`/api/admin/team/${currentMember.id}`, {
                    displayOrder: targetDisplayOrder
                }),
                axios.put(`/api/admin/team/${targetMember.id}`, {
                    displayOrder: currentDisplayOrder
                })
            ]);

            toast.success("Member order updated successfully");
            router.refresh();

        } catch (error) {
            console.error("Error updating member order:", error);

            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Failed to update member order";
                toast.error(message);
            } else {
                toast.error("Failed to update member order");
            }
        } finally {
            setIsUpdating(false);
        }
    }

    // Helper function to initialize display orders for members with null values
    const initializeDisplayOrders = async () => {
        const updates = sortedTeamMembers
            .filter(member => member.displayOrder === null)
            .map((member, index) => ({
                id: member.id,
                displayOrder: sortedTeamMembers.length + index + 1 // Assign orders after existing ones
            }));

        if (updates.length === 0) return;

        const updatePromises = updates.map(update =>
            axios.put(`/api/admin/team/${update.id}`, {
                displayOrder: update.displayOrder
            })
        );

        await Promise.all(updatePromises);
        router.refresh();
    }

    // Check if any team member has null displayOrder
    const hasNullDisplayOrders = sortedTeamMembers.some(member => member.displayOrder === null);

    return (
        <div className="rounded-md border">
            {hasNullDisplayOrders && (
                <div className="p-4 bg-yellow-50 border-b border-yellow-200">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-yellow-800">
                            Some team members don&apos;t have display orders assigned. Initialize them to enable reordering.
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={initializeDisplayOrders}
                            disabled={isUpdating}
                            className="bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
                        >
                            Initialize Display Orders
                        </Button>
                    </div>
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Facebook Url</TableHead>
                        <TableHead>Display Order</TableHead>
                        <TableHead className="text-center">Order</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedTeamMembers?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                                No Team Members found
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedTeamMembers?.map((teamMember, index) => (
                            <TableRow key={teamMember.id} className={teamMember.displayOrder === null ? 'bg-yellow-50' : ''}>
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
                                    <span className={teamMember.displayOrder === null ? 'text-yellow-600 font-medium' : ''}>
                                        {teamMember.displayOrder ?? 'Not set'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        {/* Move Up/Down Buttons */}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => moveImage(teamMember.id, 'up')}
                                            disabled={
                                                index === 0 ||
                                                isUpdating ||
                                                teamMember.displayOrder === null ||
                                                hasNullDisplayOrders
                                            }
                                            title="Move up"
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => moveImage(teamMember.id, 'down')}
                                            disabled={
                                                index === sortedTeamMembers.length - 1 ||
                                                isUpdating ||
                                                teamMember.displayOrder === null ||
                                                hasNullDisplayOrders
                                            }
                                            title="Move down"
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="flex gap-2 justify-end">
                                    <EditTeamMember teamMember={teamMember} />
                                    <DeleteTeamMember teamMember={teamMember} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}