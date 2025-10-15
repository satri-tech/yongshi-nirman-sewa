'use client'
import { Button } from "@/features/shared/components/button"
import { Plus, Loader2 } from "lucide-react"
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
} from "@/features/shared/components/form"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/features/shared/components/sheet"
import { Input } from "@/features/shared/components/input"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ProfileImageUploader from "./ProfileImageUploader"

export const teamMemberFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
    role: z.string().min(2, "Role must be at least 2 characters").max(100, "Role must be less than 100 characters"),
    facebookUrl: z.string(),
    image: z
        .instanceof(File, { message: "Profile image is required" })
        .refine(
            (file) => file.size > 0, // This ensures a file is selected
            {
                message: "Profile image is required",
            }
        )
        .refine(
            (file) => {
                return file.size <= 5 * 1024 * 1024; // 5MB limit
            },
            {
                message: "Image must be under 5MB",
            }
        )
        .refine(
            (file) => {
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                return allowedTypes.includes(file.type);
            },
            {
                message: "Only JPEG, PNG, and WebP images are allowed",
            }
        ),
})




// API service function
async function addNewTeamMember(formData: FormData) {
    const response = await fetch('/api/admin/team', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export default function AddTeamMember() {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Define form
    const form = useForm<z.infer<typeof teamMemberFormSchema>>({
        resolver: zodResolver(teamMemberFormSchema),
        defaultValues: {
            name: "",
            role: "",
            facebookUrl: "",
        },
    })

    // Submit handler with API integration
    async function onSubmit(values: z.infer<typeof teamMemberFormSchema>) {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Create FormData object for file upload
            const formData = new FormData();

            // Append all form fields
            formData.append("name", values.name);
            formData.append("role", values.role);
            formData.append("facebookUrl", values.facebookUrl);

            // Append image file
            if (values.image) {
                console.log(`Appending image: ${values.image.name}, Size: ${values.image.size}, Type: ${values.image.type}`);
                formData.append("image", values.image);
            }

            // Debug log
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }

            // Call API endpoint
            const result = await addNewTeamMember(formData);

            if (result.success) {
                toast.success("New Team Member Added  Successfully! 🎉", {
                    description: result.message || `Team Member from "${values.name}" has been added.`,
                    duration: 5000,
                });

                // Reset form
                form.reset({
                    name: "",
                    role: "",
                    facebookUrl: "",
                    image: undefined
                });

                // Reset file input
                const fileInput = document.getElementById("image-input") as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = "";
                }

                // Close the sheet and refresh
                setIsSheetOpen(false);
                router.refresh();
            } else {
                console.error("API error:", result.error);
                toast.error("Failed to Create Testimonial ❌", {
                    description: result.error || "Something went wrong. Please try again.",
                    duration: 5000,
                });
            }

        } catch (error) {
            console.error("Submission error:", error);

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

    // Handle form cancellation
    function handleCancel() {
        form.reset();
        setIsSheetOpen(false);
    }

    // Watch selected image for preview
    const selectedImage = form.watch("image");

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button onClick={() => setIsSheetOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add New Member
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl gap-0 pb-2 p-6 md:max-w-2xl font-medium dark:bg-neutral-950 text-black dark:text-white overflow-y-auto">
                <SheetHeader className="mb-2 p-0 border-b pb-4 gap-0.5">
                    <SheetTitle className="text-xl">Add New Member</SheetTitle>
                    <SheetDescription className="text-sm font-normal">
                        Add a new member entry. All fields marked with * are required.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        {/* Profile Image Section */}
                        <div className="flex flex-col space-y-4">
                            <FormField
                                control={form.control}
                                name="image"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">
                                            Profile Image
                                        </FormLabel>
                                        <FormControl>
                                            <ProfileImageUploader
                                                form={form}
                                                selectedImage={selectedImage || null}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Client Information Section */}
                        <div className="flex flex-col space-y-4 border-b pb-6">
                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">
                                                Full Name <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter member's full name..."
                                                    {...field}
                                                    className="resize-none text-sm py-5"
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">
                                                Role/Position <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., CEO, Manager, etc."
                                                    {...field}
                                                    className="resize-none text-sm py-5"
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Testimonial Content Section */}
                        <div className="flex flex-col space-y-4 border-b pb-6">
                            <FormField
                                control={form.control}
                                name="facebookUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Facebook Url <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the facebook url..."
                                                {...field}
                                                className=" text-sm py-5"
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <div className="flex justify-between">
                                            <FormMessage />
                                            <span className="text-xs text-muted-foreground">
                                                {field.value?.length || 0}/1000 characters
                                            </span>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>


                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-6">
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
                                        Save Testimonial <Plus />
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