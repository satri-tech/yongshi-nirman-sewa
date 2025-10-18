import { FormControl, FormField, FormItem, FormMessage } from "@/features/shared/components/form";
import { Input } from "@/features/shared/components/input";
import { ImageIcon, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { formSchema as createFormSchema } from "../components/AddProject"; // Import create schema
import { formSchema as editFormSchema } from "../components/EditProject"; // Import edit schema
import { toast } from "sonner";
import { useRef, useState } from "react";
import Image from "next/image";
import { z } from "zod";

// Union type for both schemas
type CreateFormSchema = z.infer<typeof createFormSchema>;
type EditFormSchema = z.infer<typeof editFormSchema>;

interface SelectImageProps {
    form: UseFormReturn<CreateFormSchema | EditFormSchema>;
    selectedAttachments?: File[];
    mode: 'create' | 'edit'; // Required prop to determine which schema validation to use
}

export default function SelectImages({
    form,
    selectedAttachments = [],
    mode
}: SelectImageProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>(selectedAttachments);

    // Conditionally determine if attachments are required based on mode
    const isRequired = mode === 'create';

    // Updated handleFileChange function - images only
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        // Allowed image types only
        const allowedImageTypes = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/gif",
            "image/webp",
        ];

        // Validate file types and sizes
        const invalidFiles = files.filter((file) => {
            // Check if file is an allowed image type
            const isValidImage = allowedImageTypes.includes(file.type);
            // Check file size (5MB limit)
            const isSizeValid = file.size <= 5 * 1024 * 1024;

            return !isValidImage || !isSizeValid;
        });

        // Show error for invalid files
        if (invalidFiles.length > 0) {
            const invalidTypes = invalidFiles.filter(
                (file) => !allowedImageTypes.includes(file.type)
            );

            const oversizedFiles = invalidFiles.filter(
                (file) => file.size > 5 * 1024 * 1024
            );

            if (invalidTypes.length > 0) {
                toast.error(
                    `Invalid file type(s): ${invalidTypes
                        .map((f) => f.name)
                        .join(", ")}. ` +
                    `Only PNG, JPG, JPEG, GIF, and WEBP images are allowed.`
                );
            }

            if (oversizedFiles.length > 0) {
                toast.error(
                    `Some files exceed 5MB limit: ${oversizedFiles
                        .map((f) => f.name)
                        .join(", ")}`
                );
            }

            // Only keep valid files
            const validFiles = files.filter(
                (file) =>
                    allowedImageTypes.includes(file.type) &&
                    file.size <= 5 * 1024 * 1024
            );

            const newFiles = [...selectedFiles, ...validFiles];
            form.setValue("attachments", newFiles);
            setSelectedFiles(newFiles);
        } else {
            const newFiles = [...selectedFiles, ...files];
            form.setValue("attachments", newFiles);
            setSelectedFiles(newFiles);
        }

        // Clear the input value
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveSelectedFile = (index: number) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
        form.setValue("attachments", updatedFiles);
    };

    return (
        <FormField
            control={form.control}
            name="attachments"
            render={() => (
                <FormItem className="w-full">
                    <FormControl>
                        <div>
                            <Input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                multiple
                                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                onChange={handleFileChange}
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer flex-col w-full rounded-lg border border-dashed border-gray-300 bg-white p-6 shadow-sm hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-950 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900 dark:text-purple-300">
                                        <ImageIcon size={24} />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <div className="text-base font-semibold text-gray-800 dark:text-neutral-200 mb-1">
                                            Upload Images {isRequired && <span className="text-red-500">*</span>}
                                        </div>
                                        {selectedFiles.length <= 0 && (
                                            <div className="text-sm text-gray-500 dark:text-neutral-400">
                                                {mode === 'create'
                                                    ? "Drag and drop images here or click to browse"
                                                    : "Add more images or click to browse"
                                                }
                                                <br />
                                                <span className="text-xs">
                                                    Supported formats: PNG, JPG, JPEG, GIF, WEBP (max 5MB each)
                                                    {mode === 'edit' && " - Optional"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2 border-t pt-4 dark:border-neutral-700">
                                        <div className="text-sm font-medium mb-2">
                                            {mode === 'create' ? 'Selected' : 'Adding'} images ({selectedFiles.length}):
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                            {selectedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group"
                                                >
                                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                                                        <Image
                                                            height={100}
                                                            width={100}
                                                            src={URL.createObjectURL(file)}
                                                            alt={file.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Overlay with file info on hover */}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2">
                                                        <div className="text-white text-xs text-center truncate w-full mb-1">
                                                            {file.name}
                                                        </div>
                                                        <div className="text-white/80 text-xs">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </div>
                                                    </div>

                                                    {/* Action buttons */}
                                                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveSelectedFile(index);
                                                            }}
                                                            className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-sm cursor-pointer"
                                                            aria-label={`Remove ${file.name}`}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {form.formState.errors.attachments && (
                                            <div className="text-sm text-red-500 dark:text-red-400 mt-2">
                                                {form.formState.errors.attachments.message}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}