import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import TestimonalsTable from "./TestimonialsTable";
import CreateTestimonial from "./CreateTestimonial";
import { fetchTestimonials } from "@/app/actions/testimonials";

export const dynamic = 'force-dynamic'

export default async function TestimonialsPage() {
    const response = await fetchTestimonials();
    const testimonials = response.data
    return <div className="min-h-screen py-2">
        <div className="w-full px-2">
            <div className=" mb-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Testimonials Management</h1>
                        <p className="mt-2">
                            Create and manage your construction projects portfolio
                        </p>
                    </div>
                </div>
                {/* Stats */}
            </div>
            <Card>

                <CardContent>
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