import { Badge } from "@/features/shared/components/badge";
import { Card, CardContent } from "@/features/shared/components/card";
import TestimonalsTable from "../../../features/testimonials/admin/components/TestimonialsTable";
import { fetchTestimonials } from "@/app/actions/testimonials";
import CreateTestimonial from "@/features/testimonials/admin/components/CreateTestimonial";

export const dynamic = 'force-dynamic'

export default async function TestimonialsPage() {
    const response = await fetchTestimonials();
    const testimonials = response.data
    return <div className="min-h-screen py-2">
        <div className="w-full sm:px-2">
            <div className=" mb-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="sm:text-3xl text-2xl font-bold">Testimonials Management</h1>
                        <p className="sm:mt-2 mt-1">
                            Create and manage your construction projects portfolio
                        </p>
                    </div>
                </div>
                {/* Stats */}
            </div>
            <Card>
                <CardContent >
                    <div className="mb-4 flex items-center justify-between">
                        <Badge variant="outline" className="text-sm">
                            Total Testimonials: {testimonials?.length}
                        </Badge>
                        <div className="flex items-center gap-2">
                            <CreateTestimonial />
                        </div>
                    </div>
                    <TestimonalsTable testimonials={testimonials} />
                </CardContent>
            </Card>
        </div>
    </div>
}