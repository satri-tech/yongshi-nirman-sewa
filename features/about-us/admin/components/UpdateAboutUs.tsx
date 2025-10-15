'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from 'react';
import { Card, CardContent } from '@/features/shared/components/card';
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
import { IAboutUs, updateAboutUs } from "@/app/actions/about";
import { Spinner } from "@/features/shared/components/spinner";

const formSchema = z.object({
    mainHeading: z.string().min(5, {
        message: "Main heading must be at least 5 characters.",
    }),
    description: z.string().min(20, {
        message: "Description must be at least 20 characters.",
    }),
    stat1Number: z.string().min(1, {
        message: "Stat 1 number is required.",
    }),
    stat1Label: z.string().min(2, {
        message: "Stat 1 label must be at least 2 characters.",
    }),
    stat2Number: z.string().min(1, {
        message: "Stat 2 number is required.",
    }),
    stat2Label: z.string().min(2, {
        message: "Stat 2 label must be at least 2 characters.",
    }),
    stat3Number: z.string().min(1, {
        message: "Stat 3 number is required.",
    }),
    stat3Label: z.string().min(2, {
        message: "Stat 3 label must be at least 2 characters.",
    }),
})

export default function UpdateAboutUsComponent({ data }: { data: IAboutUs | null }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mainHeading: data?.mainHeading,
            description: data?.description,
            stat1Number: data?.stat1Number,
            stat1Label: data?.stat1Label,
            stat2Number: data?.stat2Number,
            stat2Label: data?.stat2Label,
            stat3Number: data?.stat3Number,
            stat3Label: data?.stat3Label,
        },
    })
    const isDirty = form.formState.isDirty;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Here you would typically save to your database
        try {
            setIsSubmitting(true)
            console.log('Saving data:', values);
            const result = await updateAboutUs({
                mainHeading: values.mainHeading,
                description: values.description,
                stat1Label: values.stat1Label,
                stat1Number: values.stat1Number,
                stat2Label: values.stat2Label,
                stat2Number: values.stat2Number,
                stat3Label: values.stat3Label,
                stat3Number: values.stat3Number
            })
            if (result.success) {
                toast.success("Changes saved succesfully!");
                setIsSubmitting(false)
            }
        } catch {
            toast.error("Error updating changes");
            setIsSubmitting(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    return <Card>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Hero Section
                        </div>

                        <FormField
                            control={form.control}
                            name="mainHeading"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Main Heading</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter main heading" {...field} />
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter company description"
                                            rows={6}
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value.length} characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Statistics Section */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Statistics
                        </div>

                        {/* Stat 1 */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="stat1Number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stat 1 Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 50+" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stat1Label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stat 1 Label</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Projects Completed" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Stat 2 */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="stat2Number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stat 2 Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 20+" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stat2Label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stat 2 Label</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Years of Experience" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Stat 3 */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="stat3Number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stat 3 Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 100%" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stat3Label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stat 3 Label</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Happy Customers" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="flex items-center gap-2" disabled={!isDirty}>
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
}