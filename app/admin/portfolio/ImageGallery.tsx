"use client"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

// Image Gallery Component
export default function ImageGallery({ images, projectTitle }) {
    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const previousImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative">
            {/* Main Image */}
            <div className="relative cursor-pointer" >
                <img
                    src={images[currentImage]?.url || "/placeholder.svg"}
                    alt={`${projectTitle} - Image ${currentImage + 1}`}
                    className="w-full h-48 object-cover rounded-t-xl"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent rounded-t-xl pointer-events-none"></div>

                {/* Image counter */}
                <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {currentImage + 1} / {images.length}
                </div>

                {/* Navigation arrows (only show if more than 1 image) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                previousImage();
                            }}
                            className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail dots (only show if more than 1 image) */}
            {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImage(index);
                            }}
                            className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${index === currentImage ? 'bg-white' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};
