'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/components/card';
import { Button } from '@/features/shared/components/button';
import { Input } from '@/features/shared/components/input';
import { Textarea } from '@/features/shared/components/textarea';
import { Save } from 'lucide-react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/features/shared/components/form"
import { toast } from "sonner";
import { IProjectsSection, updateProjectsSection } from "@/app/actions/projects-section";
import { Spinner } from "@/features/shared/components/spinner";

const formSchema = z.object({
    title: z.string().min(3, {
        message: "Title must be at least 3 characters.",
    }),
    subtitle: z.string().min(10, {
        message: "Subtitle must be at least 10 characters.",
    }),
})

export default function UpdateProjectsSectionComponent({ data }: { data: IProjectsSection | null }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: data?.title || "",
            subtitle: data?.subtitle || "",
        },
    })
    const isDirty = form.formState.isDirty;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true)
            const result = await updateProjectsSection({
                title: values.title,
                subtitle: values.subtitle,
            })
            if (result.success) {
                toast.success("Projects section updated successfully!");
                form.reset(values);
            } else {
                toast.error(result.message || "Error updating projects section");
            }
        } catch {
            toast.error("Error updating projects section");
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Section Header</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Projects" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This appears as the section header on the homepage
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subtitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section Subtitle</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g., Let's dive into our Journey!"
                                            rows={3}
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value?.length || 0} characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="flex items-center gap-2" disabled={!isDirty || isSubmitting}>
                            {
                                isSubmitting ? <Spinner /> :
                                    <Save className="w-4 h-4" />
                            }
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
