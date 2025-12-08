'use client'

import { FormControl, FormField, FormItem, FormMessage } from "@/features/shared/components/form";
import { Input } from "@/features/shared/components/input";
import { ImageIcon, X } from "lucide-react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { toast } from "sonner";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface SelectImagesProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fieldName?: Path<T>;
  selectedAttachments?: File[];
  mode?: 'create' | 'edit';
  isRequired?: boolean;
}

export default function SelectImages<T extends FieldValues>({
  form,
  fieldName = 'attachments' as Path<T>,
  selectedAttachments = [],
  mode = 'edit',
  isRequired = false,
}: SelectImagesProps<T>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>(selectedAttachments);
  const [isDragActive, setIsDragActive] = useState(false);

  // Sync selectedFiles with form value
  useEffect(() => {
    const formValue = form.watch(fieldName);
    if (Array.isArray(formValue)) {
      setSelectedFiles(formValue);
    }
  }, [form.watch(fieldName), fieldName, form]);

  const allowedImageTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/webp",
  ];

  const validateFiles = (files: File[]) => {
    const invalidFiles = files.filter((file) => {
      const isValidImage = allowedImageTypes.includes(file.type);
      const isSizeValid = file.size <= 5 * 1024 * 1024;
      return !isValidImage || !isSizeValid;
    });

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
            .join(", ")}. Only PNG, JPG, JPEG, GIF, and WEBP images are allowed.`
        );
      }

      if (oversizedFiles.length > 0) {
        toast.error(
          `Some files exceed 5MB limit: ${oversizedFiles
            .map((f) => f.name)
            .join(", ")}`
        );
      }

      return files.filter(
        (file) =>
          allowedImageTypes.includes(file.type) &&
          file.size <= 5 * 1024 * 1024
      );
    }

    return files;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      form.setValue(fieldName, newFiles as any);
      setSelectedFiles(newFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files || []);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      form.setValue(fieldName, newFiles as any);
      setSelectedFiles(newFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    form.setValue(fieldName, updatedFiles as any);
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
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
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col w-full rounded-lg border-2 border-dashed p-6 shadow-sm transition-all ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                    : 'border-gray-300 bg-white hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900 dark:text-purple-300">
                    <ImageIcon size={24} />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="text-base font-semibold text-gray-800 dark:text-neutral-200 mb-1">
                      Upload Images {isRequired && <span className="text-red-500">*</span>}
                    </div>
                    {selectedFiles.length === 0 && (
                      <div className="text-sm text-gray-500 dark:text-neutral-400">
                        {isDragActive
                          ? "Drop images here"
                          : mode === 'create'
                          ? "Drag and drop images here or click to browse"
                          : "Add more images or click to browse"}
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
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">
                        {mode === 'create' ? 'Selected' : 'Adding'} images ({selectedFiles.length}):
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                            <Image
                              height={100}
                              width={100}
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2">
                            <div className="text-white text-xs text-center truncate w-full mb-1">
                              {file.name}
                            </div>
                            <div className="text-white/80 text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(index);
                            }}
                            className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-sm cursor-pointer"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors[fieldName] && (
                      <div className="text-sm text-red-500 dark:text-red-400 mt-2">
                        {(form.formState.errors[fieldName]?.message as string) || 'Invalid files'}
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
