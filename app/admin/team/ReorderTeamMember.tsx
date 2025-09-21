'use client'
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ITeamMember } from "@/app/actions/teamMembers";

interface ReorderTeamMemberProps {
    teamMember: ITeamMember;
    allTeamMembers: ITeamMember[];
}

// API service function to update display order
async function updateDisplayOrder(teamMember1Id: string, teamMember1Order: number, teamMember2Id: string, teamMember2Order: number) {
    const response = await fetch('/api/admin/team/reorder', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            teamMember1: {
                id: teamMember1Id,
                displayOrder: teamMember1Order
            },
            teamMember2: {
                id: teamMember2Id,
                displayOrder: teamMember2Order
            }
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export default function ReorderTeamMember({ teamMember, allTeamMembers }: ReorderTeamMemberProps) {
    const router = useRouter();
    const [isReordering, setIsReordering] = useState(false);

    // Sort team members by display order to find adjacent items
    // Handle null displayOrder values by treating them as high numbers (end of list)
    const sortedMembers = [...allTeamMembers].sort((a, b) => {
        const aOrder = a.displayOrder ?? 9999;
        const bOrder = b.displayOrder ?? 9999;
        return aOrder - bOrder;
    });
    const currentIndex = sortedMembers.findIndex(member => member.id === teamMember.id);
    
    const canMoveUp = currentIndex > 0;
    const canMoveDown = currentIndex < sortedMembers.length - 1;

    const handleReorder = async (direction: 'up' | 'down') => {
        if (isReordering) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const targetMember = sortedMembers[targetIndex];

        if (!targetMember) {
            toast.error("Cannot move item further in that direction");
            return;
        }

        setIsReordering(true);

        try {
            // Swap display orders (ensure we handle null values)
            const currentOrder = teamMember.displayOrder ?? 0;
            const targetOrder = targetMember.displayOrder ?? 0;
            
            // Call the API with swapped display orders
            const result = await updateDisplayOrder(
                teamMember.id,      // Current member ID
                targetOrder,        // Gets target's order (swapped)
                targetMember.id,    // Target member ID  
                currentOrder        // Gets current's order (swapped)
            );

            if (result.success) {
                toast.success("Display order updated successfully! 🎉", {
                    duration: 3000,
                });
                router.refresh(); // Refresh to show new order
            } else {
                toast.error("Failed to update display order ❌", {
                    description: result.error || "Something went wrong. Please try again.",
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error("Reorder error:", error);
            
            let errorMessage = "An unexpected error occurred. Please try again.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("Reorder Error ❌", {
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setIsReordering(false);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <Button
                size="sm"
                variant="outline"
                onClick={() => handleReorder('up')}
                disabled={!canMoveUp || isReordering}
                className="h-6 w-6 p-0 hover:bg-blue-50 disabled:opacity-30"
                title="Move up"
            >
                <ChevronUp className="h-3 w-3" />
            </Button>
            
            <Button
                size="sm"
                variant="outline"
                onClick={() => handleReorder('down')}
                disabled={!canMoveDown || isReordering}
                className="h-6 w-6 p-0 hover:bg-blue-50 disabled:opacity-30"
                title="Move down"
            >
                <ChevronDown className="h-3 w-3" />
            </Button>
        </div>
    );
}
