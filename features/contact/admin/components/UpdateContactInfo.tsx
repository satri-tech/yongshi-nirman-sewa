'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { useState } from 'react';
import { Card, CardContent } from '@/features/shared/components/card';
import { Button } from '@/features/shared/components/button';
import { Input } from '@/features/shared/components/input';
import { Save, Plus, Trash2, Undo2 } from 'lucide-react';
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
import { IContactInfo, updateContactInfo } from "@/app/actions/contact-info";
import { Spinner } from "@/features/shared/components/spinner";
import { IconPicker } from "@/features/shared/components/IconPicker";

const socialLinkSchema = z.object({
    platform: z.string().min(1, "Platform name is required"),
    icon: z.string().min(1, "Icon is required"),
    url: z.string().url("Please enter a valid URL"),
    displayOrder: z.number(),
});

const formSchema = z.object({
    address: z.string().min(5, {
        message: "Address must be at least 5 characters.",
    }),
    phone: z.string().min(5, {
        message: "Phone number must be at least 5 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    socialLinks: z.array(socialLinkSchema),
})

export default function UpdateContactInfoComponent({ data }: { data: IContactInfo | null }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletedIndices, setDeletedIndices] = useState<Set<number>>(new Set())

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: data?.address || "",
            phone: data?.phone || "",
            email: data?.email || "",
            socialLinks: data?.socialLinks || [],
        },
    })
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "socialLinks",
    });
    
    const isDirty = form.formState.isDirty || deletedIndices.size > 0;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true)
            
            // Filter out deleted items before submitting
            const activeSocialLinks = values.socialLinks.filter((_, index) => !deletedIndices.has(index));
            
            const result = await updateContactInfo({
                address: values.address,
                phone: values.phone,
                email: values.email,
                socialLinks: activeSocialLinks,
            })
            if (result.success) {
                toast.success("Contact information saved successfully!");
                
                // Remove deleted items from the form
                const sortedIndices = Array.from(deletedIndices).sort((a, b) => b - a);
                sortedIndices.forEach(index => remove(index));
                
                // Clear deleted indices
                setDeletedIndices(new Set());
                
                form.reset(form.getValues());
            } else {
                toast.error(result.message || "Error updating contact information");
            }
        } catch {
            toast.error("Error updating contact information");
        } finally {
            setIsSubmitting(false)
        }
    }

    const addSocialLink = () => {
        append({
            platform: "",
            icon: "Facebook",
            url: "",
            displayOrder: fields.length,
        });
    };

    const markForDeletion = (index: number) => {
        setDeletedIndices(prev => {
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
        });
    };

    const restoreItem = (index: number) => {
        setDeletedIndices(prev => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
        });
    };

    return <Card>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Contact Information Section */}
                    <div className="space-y-4">
                        <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Contact Information
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter phone number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter email address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Social Links Section */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Social Media Links
                                    {deletedIndices.size > 0 && (
                                        <span className="ml-2 text-xs text-destructive font-normal">
                                            ({deletedIndices.size} marked for deletion)
                                        </span>
                                    )}
                                </div>
                                <FormDescription>
                                    Add social media links that will appear on your contact page
                                </FormDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addSocialLink}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Link
                            </Button>
                        </div>

                        {fields.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                No social links added yet. Click "Add Link" to get started.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {fields.map((field, index) => {
                                    const isDeleted = deletedIndices.has(index);
                                    return (
                                        <Card 
                                            key={field.id} 
                                            className={`p-4 transition-all ${isDeleted ? 'opacity-50 bg-destructive/10 border-destructive' : ''}`}
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={`font-medium ${isDeleted ? 'line-through text-muted-foreground' : ''}`}>
                                                        Social Link #{index + 1}
                                                        {isDeleted && <span className="ml-2 text-xs text-destructive">(Marked for deletion)</span>}
                                                    </h4>
                                                    <div className="flex gap-2">
                                                        {isDeleted ? (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => restoreItem(index)}
                                                            >
                                                                <Undo2 className="w-4 h-4 mr-2" />
                                                                Restore
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => markForDeletion(index)}
                                                            >
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isDeleted ? 'pointer-events-none' : ''}`}>
                                                    <FormField
                                                        control={form.control}
                                                        name={`socialLinks.${index}.icon`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Icon</FormLabel>
                                                                <FormControl>
                                                                    <IconPicker
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                        disabled={isDeleted}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name={`socialLinks.${index}.platform`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Platform Name</FormLabel>
                                                                <FormControl>
                                                                    <Input 
                                                                        placeholder="e.g., Facebook" 
                                                                        {...field} 
                                                                        disabled={isDeleted}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name={`socialLinks.${index}.url`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>URL</FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                    placeholder="https://..." 
                                                                    {...field} 
                                                                    disabled={isDeleted}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>

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
}
