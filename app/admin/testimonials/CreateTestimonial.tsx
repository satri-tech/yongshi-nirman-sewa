'use client'
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Star } from "lucide-react"
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
import { useState } from "react"
import { useRouter } from "next/navigation"
import ImageSelector from "./ImageSelector"

export const testimonialFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
    role: z.string().min(2, "Role must be at least 2 characters").max(100, "Role must be less than 100 characters"),
    content: z.string().min(10, "Testimonial content must be at least 10 characters").max(1000, "Content must be less than 1000 characters"),
    rating: z.enum(["1", "2", "3", "4", "5"], {
        required_error: "Please select a rating",
    }),
    image: z
        .instanceof(File)
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



// Rating display component
interface RatingDisplayProps {
    rating: string;
}

function RatingDisplay({ rating }: RatingDisplayProps) {
    const ratingNum = parseInt(rating);

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= ratingNum
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        }`}
                />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
                ({rating} out of 5)
            </span>
        </div>
    );
}

// API service function
async function createTestimonialAPI(formData: FormData) {
    const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export default function CreateTestimonial() {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Define form
    const form = useForm<z.infer<typeof testimonialFormSchema>>({
        resolver: zodResolver(testimonialFormSchema),
        defaultValues: {
            name: "",
            role: "",
            content: "",
        },
    })

    // Submit handler with API integration
    async function onSubmit(values: z.infer<typeof testimonialFormSchema>) {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Create FormData object for file upload
            const formData = new FormData();

            // Append all form fields
            formData.append("name", values.name);
            formData.append("role", values.role);
            formData.append("content", values.content);
            formData.append("rating", values.rating);

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
            const result = await createTestimonialAPI(formData);

            if (result.success) {
                toast.success("Testimonial Created Successfully! 🎉", {
                    description: result.message || `Testimonial from "${values.name}" has been added.`,
                    duration: 5000,
                });

                // Reset form
                form.reset({
                    name: "",
                    role: "",
                    content: "",
                    rating: undefined,
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
    const selectedRating = form.watch("rating");

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button onClick={() => setIsSheetOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add New Testimonial
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl gap-0 pb-2 p-6 md:max-w-2xl font-medium dark:bg-neutral-950 text-black dark:text-white overflow-y-auto">
                <SheetHeader className="mb-2 p-0 border-b pb-4 gap-0.5">
                    <SheetTitle className="text-xl">Add New Testimonial</SheetTitle>
                    <SheetDescription className="text-sm font-normal">
                        Create a new testimonial entry. All fields marked with * are required.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
                                                    placeholder="Enter client's full name..."
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
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Testimonial Text <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter the testimonial content..."
                                                {...field}
                                                className="resize-none text-sm min-h-[120px]"
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

                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Rating <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select rating" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="5">5 Stars - Excellent</SelectItem>
                                                <SelectItem value="4">4 Stars - Very Good</SelectItem>
                                                <SelectItem value="3">3 Stars - Good</SelectItem>
                                                <SelectItem value="2">2 Stars - Fair</SelectItem>
                                                <SelectItem value="1">1 Star - Poor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {selectedRating && (
                                            <div className="mt-2">
                                                <RatingDisplay rating={selectedRating} />
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Profile Image Section */}
                        <div className="flex flex-col space-y-4">

                            <FormField
                                control={form.control}
                                name="image"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">
                                            Profile Image <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <ImageSelector
                                                form={form}
                                                selectedImage={selectedImage || null}
                                            />
                                        </FormControl>
                                        <p className="text-sm text-muted-foreground">
                                            Supported formats: JPEG, PNG, WebP. Max 5MB.
                                        </p>
                                        <FormMessage />
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