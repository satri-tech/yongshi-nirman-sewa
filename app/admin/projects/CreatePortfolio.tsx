'use client'
import { Button } from "@/components/ui/button"
import { Plus, Paperclip, Loader2 } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import SelectStartDate from "./components/StartDate"
import SelectEndDate from "./components/SelectEndDate"
import { useState } from "react"
import SelectImages from "./components/SelectImages"
import { useRouter } from "next/navigation"

export interface IFiles {
    url: string;
    fileType: string;
}

export const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(50, "Title must be less than 50 characters"),
    description: z.string().min(2, "Description must be at least 2 characters").max(400, "Description must be less than 400 characters"),
    location: z.string().min(2, "Location must be at least 2 characters").max(100, "Location must be less than 100 characters"),
    clientname: z.string().min(2, "Client name must be at least 2 characters").max(100, "Client name must be less than 100 characters"),
    area: z.string().min(2, "Area must be at least 2 characters").max(100, "Area must be less than 100 characters"),
    status: z.enum(["completed", "inprogress", "pending", "onhold"], {
        required_error: "Please select a status",
    }),
    startDate: z.date({
        required_error: "Start Date is required.",
    }),
    endDate: z.date({
        required_error: "End Date is required.",
    }),
    attachments: z
        .array(z.instanceof(File))
        .optional()
        .nullable()
        .refine(
            (files) => {
                if (!files) return true;
                return files.every((file) => {
                    return file.size <= 5 * 1024 * 1024; // 5MB limit
                });
            },
            {
                message: "Each file must be under 5MB",
            }
        )
        .refine(
            (files) => {
                if (!files) return true;
                const allowedTypes = [
                    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                ];
                return files.every((file) => allowedTypes.includes(file.type));
            },
            {
                message: "Only images, PDFs, and Office documents are allowed",
            }
        ),
})

// API service function
async function createProjectAPI(formData: FormData) {
    const response = await fetch('/api/admin/projects', {
        method: 'POST',
        body: formData, // Don't set Content-Type header, let browser set it with boundary
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export default function CreatePortfolio() {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // 1. Define your form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            clientname: "",
            location: "",
            area: "",
            attachments: []
        },
    })

    // 2. Define submit handler with API integration
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (isSubmitting) return; // Prevent double submission

        setIsSubmitting(true);

        try {
            // Create FormData object for file upload
            const formData = new FormData();

            // Append all form fields
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("location", values.location);
            formData.append("clientname", values.clientname);
            formData.append("area", values.area);

            // Map status values to match server expectations
            const statusMapping = {
                'completed': 'Completed',
                'inprogress': 'InProgress',
                'pending': 'Pending',
                'onhold': 'OnHold'
            };
            formData.append("status", statusMapping[values.status]);

            // Append dates as ISO strings
            if (values.startDate) {
                formData.append("startDate", values.startDate.toISOString());
            }
            if (values.endDate) {
                formData.append("endDate", values.endDate.toISOString());
            }

            // Append files
            if (values.attachments && values.attachments.length > 0) {
                console.log(`Appending ${values.attachments.length} files to FormData`);
                values.attachments.forEach((file, index) => {
                    console.log(`File ${index + 1}: ${file.name}, Size: ${file.size}, Type: ${file.type}`);
                    formData.append("attachments", file);
                });
            }

            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }

            // Call API endpoint
            const result = await createProjectAPI(formData);

            if (result.success) {
                toast.success("Project Created Successfully! 🎉", {
                    description: result.message || `Project "${values.title}" has been added to your portfolio.`,
                    duration: 5000,
                });
                form.reset({
                    title: "",
                    description: "",
                    clientname: "",
                    location: "",
                    area: "",
                    startDate: undefined,
                    endDate: undefined,
                    attachments: []
                });

                // Close the sheet
                setIsSheetOpen(false);
                router.refresh();


            } else {
                console.error("API error:", result.error);
                toast.error("Failed to Create Project ❌", {
                    description: result.error || "Something went wrong. Please try again.",
                    duration: 5000,
                });
            }

        } catch (error) {
            console.error("Submission error:", error);

            // Handle network errors or API errors
            let errorMessage = "An unexpected error occurred. Please try again.";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("Submission Error ❌", {
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    // Function to handle form cancellation
    function handleCancel() {
        form.reset();
        setIsSheetOpen(false);
    }

    // Get file count for display
    const attachmentCount = form.watch("attachments")?.length || 0;

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button onClick={() => setIsSheetOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add New Project
                </Button>
            </SheetTrigger>
            <SheetContent className={`sm:max-w-xl gap-0 pb-2 p-6 md:max-w-2xl lg:max-w-3xl font-medium dark:bg-neutral-950 text-black dark:text-white overflow-y-auto`}>
                <SheetHeader className="mb-2 p-0 border-b pb-4">
                    <SheetTitle className="text-2xl">Add New Project</SheetTitle>
                    <SheetDescription className="text-base font-normal">
                        Create a new project entry for your portfolio. All fields marked with * are required.
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
                                            <Input
                                                placeholder="Enter project title..."
                                                {...field}
                                                className="resize-none text-base py-5"
                                                disabled={isSubmitting}
                                            />
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
                                            <Textarea
                                                placeholder="Enter project description..."
                                                {...field}
                                                className="resize-none text-base min-h-[80px]"
                                                disabled={isSubmitting}
                                            />
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
                                                <Input
                                                    placeholder="Enter client's name..."
                                                    {...field}
                                                    className="resize-none text-base py-5"
                                                    disabled={isSubmitting}
                                                />
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
                                                <Input
                                                    placeholder="Enter project location..."
                                                    {...field}
                                                    className="resize-none text-base py-5"
                                                    disabled={isSubmitting}
                                                />
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
                                                        <span className="text-sm text-muted-foreground font-medium">
                                                            sq ft
                                                        </span>
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
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isSubmitting}
                                            >
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

                        {/* Attachments Section */}
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center gap-2">
                                <Paperclip size={16} />
                                <h3 className="font-medium">Attachments</h3>
                                {attachmentCount > 0 && (
                                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                        {attachmentCount} file{attachmentCount !== 1 ? 's' : ''} selected
                                    </span>
                                )}
                            </div>
                            <SelectImages
                                form={form}
                                selectedAttachments={form.watch("attachments") || []}
                            />
                            <p className="text-sm text-muted-foreground">
                                Supported formats: Images (JPEG, PNG, WebP, GIF), PDFs, and Office documents. Max 5MB per file.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="py-5 px-5"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="py-5"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        Save Project <Plus />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}