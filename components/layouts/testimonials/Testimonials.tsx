'use client'
import HeaderTitle from "@/components/ui/HeaderTitle";
// import { testimonials } from "./constants";
// import { Card, CardContent } from "@/components/ui/card";
// import { Star } from "lucide-react";
// import Image from "next/image";


export default function Testimonials() {
    return <div id="testimonials"
        className={`flex lg:flex-row flex-col justify-center items-center w-full mt-24 h-max border-t-[0.1px] font-Poppins sm:pt-16 pt-8`}
    >
        <div className="font-Poppins flex flex-col  lg:w-[92%] w-[90%] ">
            <div className="flex w-full sm:gap-6 gap-4 flex-col ">
                <HeaderTitle header={"Testimonials"} className="w-[120px]" />
                <div className="w-full flex">
                    <div className="w-full sm:text-5xl text-3xl font-medium leading-[4.4rem] tracking-tight">
                        {`Trusted by clients who value quality and results.`}
                    </div>
                </div>
                <div className="h-screen flex justify-center items-center text-3xl">
                    Coming Soon
                </div>
                {/* <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.content} className="h-full py-2">
                            <CardContent className="p-6">
                                <div className="flex flex-col h-full">
                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < testimonial.rating
                                                    ? "fill-yellow-400 text-yellow-500"
                                                    : "fill-muted text-muted-foreground"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <blockquote className="text-sm text-muted-foreground mb-6 flex-grow">
                                        {` "${testimonial.content}"`}
                                    </blockquote>

                                    <div className="flex items-center gap-3 mt-auto">
                                        <Image
                                            height={48}
                                            width={48}
                                            src={testimonial.image.src}
                                            alt={"image"}
                                            className="h-12 w-12 object-cover rounded-full border"
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/default-avatar.png';
                                            }}
                                        />
                                        <div>
                                            <div className="font-semibold text-sm">{testimonial.name}</div>
                                            <div className="text-xs text-muted-foreground">{testimonial.role}</div>

                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div> */}
            </div>
        </div>
    </div >
}