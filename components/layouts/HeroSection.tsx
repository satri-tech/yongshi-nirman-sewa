export default function HeroSection() {
    return <section className="w-full py-12 md:py-24 lg:py-32 xl:py-24 xl:px-10 bg-gray-100">
        <div className="px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">

                {/* Left Content Placeholder */}
                <div className="flex flex-col justify-center space-y-6">
                    {/* Badge Placeholder */}
                    <div className="h-6 w-48 bg-gray-300 rounded"></div>

                    {/* Title Placeholder */}
                    <div className="space-y-3">
                        <div className="h-8 w-full max-w-xl bg-gray-300 rounded"></div>
                        <div className="h-8 w-full max-w-lg bg-gray-300 rounded"></div>
                    </div>

                    {/* Paragraph Placeholder */}
                    <div className="space-y-2">
                        <div className="h-4 w-full max-w-2xl bg-gray-200 rounded"></div>
                        <div className="h-4 w-full max-w-xl bg-gray-200 rounded"></div>
                        <div className="h-4 w-full max-w-lg bg-gray-200 rounded"></div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 min-[400px]:flex-row">
                        <div className="h-10 w-40 bg-gray-300 rounded"></div>
                        <div className="h-10 w-40 bg-gray-200 rounded border border-gray-300"></div>
                    </div>

                    {/* Feature Points */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                        <div className="h-4 w-56 bg-gray-200 rounded"></div>
                        <div className="h-4 w-64 bg-gray-200 rounded"></div>
                    </div>
                </div>

                {/* Right Image Placeholder */}
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-[600px] h-[320px] bg-gray-300 rounded-xl shadow-inner"></div>
                </div>
            </div>
        </div>
    </section>

}