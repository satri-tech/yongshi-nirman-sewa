'use client'
import { deleteContact } from "@/app/actions/contact";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface IDeleteContactProps {
    id: string;
    fullName: string
}
const DeleteContact = ({ id, fullName }: IDeleteContactProps) => {
    const router = useRouter()
    const handleDeleteContact = async () => {
        try {
            const response = await deleteContact(id)
            if (response.success) {
                toast.success("Message Deleted Succesfully");
                router.refresh();
            }

        } catch (error) {
            let errorMessage = "An unexpected error occurred. Please try again.";
            if (error instanceof Error) {
                errorMessage = error.message
            }
            toast.error("Deletion Error ❌", {
                description: errorMessage,
                duration: 5000,
            });
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon"
                >
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Contact Message</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this contact message from {fullName}? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDeleteContact}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteContact
