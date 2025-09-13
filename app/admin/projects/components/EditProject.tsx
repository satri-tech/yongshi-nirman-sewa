'use client'

import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";

import SelectStartDate from "./StartDate";
import SelectEndDate from "./SelectEndDate";
import SelectImages from "./SelectImages";
import { formSchema as baseSchema } from "../CreatePortfolio";
import { IProject } from "@/app/actions/fetchProjects";

// Reuse the create form schema for consistency
const formSchema = baseSchema;

// API service function for update
async function updateProjectAPI(formData: FormData) {
  const response = await fetch('/api/admin/projects', {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

interface EditProjectProps {
  project: IProject
}

export default function EditProject({ project }: EditProjectProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [removedExisting, setRemovedExisting] = useState<Set<string>>(new Set());

  // Map server status to form status values
  const statusToForm = (s: EditProjectProps['project']['status']): 'completed' | 'inprogress' | 'pending' | 'onhold' => {
    switch (s) {
      case 'Completed':
        return 'completed';
      case 'InProgress':
        return 'inprogress';
      case 'Pending':
        return 'pending';
      case 'OnHold':
        return 'onhold';
      default:
        return 'pending';
    }
  };

  // Get initial form values
  const getInitialValues = () => ({
    title: project.title ?? '',
    description: project.description ?? '',
    clientname: project.client ?? '',
    location: project.location ?? '',
    area: project.area ?? '',
    status: statusToForm(project.status),
    startDate: project.startDate ? new Date(project.startDate) : undefined,
    endDate: project.endDate ? new Date(project.endDate) : undefined,
    attachments: [], // Always start with empty attachments
  });

  // Initial form values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(),
  });

  const existingImagesToKeep = useMemo(() => {
    return project.images.filter((url) => !removedExisting.has(url));
  }, [project.images, removedExisting]);

  function toggleRemoveExisting(url: string) {
    setRemovedExisting((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url); else next.add(url);
      return next;
    });
  }

  // Reset form to initial state
  function resetFormToInitial() {
    form.reset(getInitialValues());
    setRemovedExisting(new Set());
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append('id', project.id);
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('location', values.location);
      formData.append('clientname', values.clientname);
      formData.append('area', values.area);

      const statusMapping = {
        'completed': 'Completed',
        'inprogress': 'InProgress',
        'pending': 'Pending',
        'onhold': 'OnHold',
      } as const;
      formData.append('status', statusMapping[values.status]);

      if (values.startDate) formData.append('startDate', values.startDate.toISOString());
      if (values.endDate) formData.append('endDate', values.endDate.toISOString());

      // Existing images to keep
      formData.append('existingImages', JSON.stringify(existingImagesToKeep));

      // New attachments
      if (values.attachments && values.attachments.length > 0) {
        values.attachments.forEach((file) => formData.append('attachments', file));
      }

      const result = await updateProjectAPI(formData);
      if (result.success) {
        toast.success('Project Updated Successfully ✅', {
          description: result.message || `Project "${values.title}" has been updated.`,
          duration: 5000,
        });

        // Reset form and close dialog
        resetFormToInitial();
        setIsSheetOpen(false);
        router.refresh();
      } else {
        toast.error('Failed to Update Project ❌', {
          description: result.error || 'Something went wrong. Please try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      toast.error('Submission Error ❌', { description: msg, duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    resetFormToInitial();
    setIsSheetOpen(false);
  }

  // Reset form when dialog opens
  function handleSheetOpenChange(open: boolean) {
    setIsSheetOpen(open);
    if (open) {
      // Reset form to initial state when opening
      resetFormToInitial();
    }
  }

  const attachmentCount = form.watch('attachments')?.length || 0;

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button className="flex-1 cursor-pointer">
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl gap-0 pb-2 p-6 md:max-w-2xl lg:max-w-3xl font-medium dark:bg-neutral-950 text-black dark:text-white overflow-y-auto">
        <SheetHeader className="mb-2 p-0 border-b pb-4">
          <SheetTitle className="text-2xl">Edit Project</SheetTitle>
          <SheetDescription className="text-base font-normal">
            Update project details and manage images. Fields marked with * are required.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-4">
            {/* Basic Information Section */}
            <div className="flex flex-col space-y-3 border-b pb-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Project Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title..." {...field} className="resize-none text-base py-5" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Project Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter project description..." {...field} className="resize-none text-base min-h-[80px]" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Project Details Section */}
            <div className="flex flex-col gap-4 border-b pb-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="clientname"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-base font-medium">
                        Client Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client's name..." {...field} className="resize-none text-base py-5" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-base font-medium">
                        Location <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project location..." {...field} className="resize-none text-base py-5" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-base font-medium">
                        Area <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter area..."
                            {...field}
                            className="resize-none text-base py-5 pr-16"
                            disabled={isSubmitting}
                            type="number"
                            min="0"
                            step="0.01"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-sm text-muted-foreground font-medium">sq ft</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Status <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select project status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="inprogress">In Progress</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="onhold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <SelectStartDate form={form} />
                <SelectEndDate form={form} />
              </div>
            </div>

            {/* Existing Images Section */}
            <div className="flex flex-col gap-3 border-b pb-4">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} />
                <h3 className="font-medium">Existing Images</h3>
              </div>
              {project.images.length === 0 ? (
                <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {project.images.map((url) => {
                    const marked = removedExisting.has(url);
                    return (
                      <div key={url} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                          <Image src={`/api/images/projects/${url}`} alt="project image" width={100} height={100} className="w-full h-full object-cover" />
                        </div>
                        {marked && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <span className="text-white text-xs">Removing</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleRemoveExisting(url)}
                          className={`absolute top-1 right-1 p-1.5 rounded-full text-white shadow-sm cursor-pointer ${marked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}
                          aria-label={marked ? 'Cancel remove' : 'Remove'}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {removedExisting.size > 0 && (
                <p className="text-xs text-muted-foreground">{removedExisting.size} image(s) will be removed when you save.</p>
              )}
            </div>

            {/* Attachments Section - Add New Images */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} />
                <h3 className="font-medium">Add More Images</h3>
                {attachmentCount > 0 && (
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {attachmentCount} file{attachmentCount !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              <SelectImages form={form} selectedAttachments={form.watch('attachments') || []} />
              <p className="text-sm text-muted-foreground">
                Supported formats: Images (JPEG, PNG, WebP, GIF). Max 5MB per file.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" className="py-5 px-5" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="py-5" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}