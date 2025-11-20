'use client'

import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/features/shared/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/form";
import { Input } from "@/features/shared/components/input";
import { Textarea } from "@/features/shared/components/textarea";
import SelectImages from "@/features/shared/components/SelectImages";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description must be less than 500 characters"),
  attachments: z
    .array(z.instanceof(File))
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      { message: "Each file must be under 5MB" }
    )
    .refine(
      (files) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        return files.every((file) => allowedTypes.includes(file.type));
      },
      { message: "Only images are allowed" }
    )
});

async function updateLandingPageAPI(formData: FormData) {
  const response = await fetch('/api/admin/landing', {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

interface LandingPageData {
  id: string;
  title: string;
  description: string;
  sliderImages: string[];
  createdAt: string;
  updatedAt: string;
}

export default function Landing() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [removedExisting, setRemovedExisting] = useState<Set<string>>(new Set());
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      attachments: [],
    },
  });

  // Fetch landing page data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/landing', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setLandingData(data.data);
            form.reset({
              title: data.data.title,
              description: data.data.description,
              attachments: [],
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch landing data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [form]);

  const existingImagesToKeep = useMemo(() => {
    return landingData?.sliderImages.filter((url) => !removedExisting.has(url)) || [];
  }, [landingData?.sliderImages, removedExisting]);

  function toggleRemoveExisting(url: string) {
    setRemovedExisting((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('existingImages', JSON.stringify(existingImagesToKeep));

      if (values.attachments && values.attachments.length > 0) {
        values.attachments.forEach((file) => formData.append('attachments', file));
      }

      const result = await updateLandingPageAPI(formData);
      if (result.success) {
        toast.success('Landing Page Updated Successfully ✅', {
          description: result.message || 'Landing page has been updated.',
          duration: 5000,
        });
        setLandingData(result.data);
        form.reset({
          title: result.data.title,
          description: result.data.description,
          attachments: [],
        });
        setRemovedExisting(new Set());
        router.refresh();
      } else {
        toast.error('Failed to Update Landing Page ❌', {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const attachmentCount = form.watch('attachments')?.length || 0;

  return (
    <div className="w-full">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Landing Page Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter landing page title..."
                      {...field}
                      className="text-base py-5"
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
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter landing page description..."
                      {...field}
                      className="text-base min-h-[100px]"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Existing Images Section */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon size={20} />
              <h2 className="text-xl font-semibold">Slider Images</h2>
            </div>

            {landingData?.sliderImages && landingData.sliderImages.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {landingData.sliderImages.map((url) => {
                    const marked = removedExisting.has(url);
                    return (
                      <div key={url} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                          <Image
                            src={`/api/images/projects/${url}`}
                            alt="slider image"
                            width={150}
                            height={150}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {marked && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <span className="text-white text-xs">Removing</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleRemoveExisting(url)}
                          className={`absolute top-1 right-1 p-1.5 rounded-full text-white shadow-sm cursor-pointer ${marked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
                            }`}
                          aria-label={marked ? 'Cancel remove' : 'Remove'}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                {removedExisting.size > 0 && (
                  <p className="text-sm text-muted-foreground">{removedExisting.size} image(s) will be removed when you save.</p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No slider images uploaded yet.</p>
            )}
          </div>

          {/* Add New Images Section */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon size={20} />
              <h2 className="text-xl font-semibold">Add Slider Images</h2>
              {attachmentCount > 0 && (
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {attachmentCount} file{attachmentCount !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>

            <SelectImages
              form={form}
              fieldName="attachments"
              selectedAttachments={form.watch('attachments') || []}
              mode="edit"
              isRequired={false}
            />

            <p className="text-sm text-muted-foreground">
              Supported formats: Images (JPEG, PNG, WebP, GIF). Max 5MB per file.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="py-5 px-6"
              onClick={() => {
                form.reset({
                  title: landingData?.title || '',
                  description: landingData?.description || '',
                  attachments: [],
                });
                setRemovedExisting(new Set());
              }}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="py-5 px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
