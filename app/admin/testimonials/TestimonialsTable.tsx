'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, User } from "lucide-react";
import Image from "next/image";
import { ITestimonial } from "./types";
import DeleteTestimonial from "./DeleteTestimonial";

interface ITestimonialsProps {
    testimonials?: ITestimonial[]
}

export default function TestimonalsTable({ testimonials }: ITestimonialsProps) {

    const truncateContent = (content: string, maxLength: number = 100) => {
        return content.length > maxLength ? content.substring(0, maxLength) + "..." : content
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
        ))
    }


    return <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {testimonials?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                            No testimonials found
                        </TableCell>
                    </TableRow>
                ) : (
                    testimonials?.map((testimonial) => (
                        <TableRow key={testimonial.id}>
                            <TableCell>
                                <Image
                                    height={48}
                                    width={48}
                                    src={`/api/images/testimonials/${testimonial.image}`}
                                    alt={testimonial.name}
                                    className="h-12 w-12 object-cover rounded-full border"
                                    onError={(e) => {
                                        // Fallback to a default image if the API fails
                                        e.currentTarget.src = '/images/default-avatar.png';
                                    }}
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {testimonial.name}
                                </div>
                            </TableCell>
                            <TableCell>{testimonial.role}</TableCell>
                            <TableCell>
                                <div className="max-w-xs">
                                    {truncateContent(testimonial.content, 20)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    {renderStars(testimonial.rating)}
                                    <span className="ml-2 text-sm text-muted-foreground">
                                        {testimonial.rating}/5
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="text-right">
                                <DeleteTestimonial testimonial={testimonial} />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </div>
}