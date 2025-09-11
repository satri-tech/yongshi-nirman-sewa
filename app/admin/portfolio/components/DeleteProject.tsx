'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

interface DeleteProjectProps {
  project: {
    id: string;
    title: string;
    images?: string[];
  };
  variant?: "icon" | "text" | "both";
  onDeleteSuccess?: () => void;
}

// API service function for delete
async function deleteProjectAPI(projectId: string) {
  const response = await fetch('/api/admin/projects', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: projectId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export default function DeleteProject({
  project,
  variant = "icon",
}: DeleteProjectProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      console.log(`Deleting project: ${project.title} (${project.id})`);

      const result = await deleteProjectAPI(project.id);

      if (result.success) {
        toast.success('Project Deleted Successfully 🗑️', {
          description: result.message || `Project "${project.title}" has been deleted.`,
          duration: 5000,
        });

        // Close dialog
        setIsOpen(false);

        // Refresh the page to reflect changes
        router.refresh();
      } else {
        toast.error('Failed to Delete Project ❌', {
          description: result.error || 'Something went wrong. Please try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      toast.error('Deletion Error ❌', {
        description: msg,
        duration: 5000
      });
    } finally {
      setIsDeleting(false);
    }
  }

  // Render button based on variant
  const renderTrigger = () => {
    switch (variant) {
      case "text":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isDeleting}
          >
            Delete
          </Button>
        );
      case "both":
        return (
          <Button
            variant="outline"
            size="default"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        );
      case "icon":
      default:
        return (
          <Button
            variant="outline"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            aria-label="Delete Project"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        );
    }
  };

  const imageCount = project.images?.length || 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {renderTrigger()}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl">Delete Project</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-3 space-y-2">
            <p>
              Are you sure you want to delete the project <strong>{project.title}</strong>?
            </p>
            {imageCount > 0 && (
              <p className="text-sm text-muted-foreground">
                This will also permanently delete {imageCount} associated image{imageCount !== 1 ? 's' : ''}.
              </p>
            )}
            <p className="text-sm font-semibold text-red-600">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Prevent default dialog close
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

