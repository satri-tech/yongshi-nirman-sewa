'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, Trash2, Upload, User } from "lucide-react";
import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";

// Define the exact types that can be accepted
type AddFormType = {
    name: string;
    role: string;
    facebookUrl: string;
    image: File;
};

type EditFormType = {
    name: string;
    role: string;
    facebookUrl: string;
    image?: File | null | undefined;
};

// Create overloaded interface definitions
interface ProfileImageUploaderProps {
    form: UseFormReturn<AddFormType> | UseFormReturn<EditFormType>;
    selectedImage: File | null;
    existingImageUrl?: string | null;
    disabled?: boolean;
}

export default function ProfileImageUploader({
    form,
    selectedImage,
    existingImageUrl,
    disabled = false
}: ProfileImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imageToRemove, setImageToRemove] = useState<boolean>(false);

    // Get the current image to display (either selected new image or existing one)
    const currentImageUrl = selectedImage
        ? URL.createObjectURL(selectedImage)
        : (!imageToRemove ? existingImageUrl : null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Type assertion to handle both AddFormType and EditFormType
            (form as UseFormReturn<EditFormType>).setValue("image", file);
            setImageToRemove(false); // Reset removal flag when new image is selected
            setIsDialogOpen(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        // Type assertion to handle both AddFormType and EditFormType  
        (form as UseFormReturn<EditFormType>).setValue("image", null);
        setImageToRemove(true); // Mark for removal
        setIsDialogOpen(false);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const hasImage = currentImageUrl || selectedImage;

    return (
        <div className="flex flex-col items-center space-y-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <div className="relative group cursor-pointer" onClick={() => !disabled && setIsDialogOpen(true)}>
                        {/* Main Profile Image Circle */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200">
                            {hasImage ? (
                                <Image
                                    src={currentImageUrl!}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    <User size={48} />
                                </div>
                            )}

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <Camera className="text-white" size={32} />
                            </div>
                        </div>

                        {/* Camera icon indicator */}
                        <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-lg transition-colors duration-200">
                            <Camera className="text-white" size={18} />
                        </div>
                    </div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Profile Picture</DialogTitle>
                        <DialogDescription>
                            Choose an option to update your profile picture.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3 py-4">
                        {/* Upload New Image */}
                        <Button
                            onClick={handleUploadClick}
                            variant="outline"
                            className="w-full justify-start gap-3 h-12"
                        >
                            <Upload size={20} />
                            Upload New Photo
                        </Button>

                        {/* Remove Current Image - only show if there's an image */}
                        {hasImage && (
                            <Button
                                onClick={handleRemoveImage}
                                variant="outline"
                                className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                            >
                                <Trash2 size={20} />
                                Remove Photo
                            </Button>
                        )}

                        {/* Cancel */}
                        <Button
                            onClick={() => setIsDialogOpen(false)}
                            variant="ghost"
                            className="w-full justify-center h-12"
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Hidden file input */}
            <Input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                disabled={disabled}
            />

            {/* Image info text */}
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    Click the profile picture to update
                </p>
                {selectedImage && (
                    <p className="text-xs text-muted-foreground mt-1">
                        New image: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                )}
                {imageToRemove && existingImageUrl && (
                    <p className="text-xs text-red-500 mt-1">
                        Current image will be removed
                    </p>
                )}
            </div>
        </div>
    );
}