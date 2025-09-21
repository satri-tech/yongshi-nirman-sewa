'use client'
import { ITeamMember } from "@/app/actions/teamMembers"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface IDeleteTeammMemberProps {
    teamMember: ITeamMember
}
// API service function for delete
async function deleteTestimonialAPI(teamMemberId: string) {
    const response = await fetch('/api/admin/team', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: teamMemberId }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}
export default function DeleteTeamMember({ teamMember }: IDeleteTeammMemberProps) {
    const router = useRouter()
    const handleDeleteTeamMember = async () => {
        try {
            const result = await deleteTestimonialAPI(teamMember.id);
            if (result.success) {
                toast.success('Team Member Deleted Successfully 🗑️', {
                    description: result.message || `Team Member "${teamMember.name}" has been deleted.`,
                    duration: 5000,
                });
                // Refresh the page to reflect changes
                router.refresh();
            } else {
                toast.error('Failed to Delete the Team Member ❌', {
                    description: result.error || 'Something went wrong. Please try again.',
                    duration: 5000,
                });
            }

        } catch (error) {
            console.error("Error deleting team member:", error)
            toast.error("Failed to delete team member. Please try again.")
        }
    }
    return <div className="flex items-center justify-end gap-2">
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="icon" className="bg-red-700 hover:bg-red-800">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this member from {teamMember.name}? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteTeamMember}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
}