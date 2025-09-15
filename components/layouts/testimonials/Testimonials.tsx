import HeaderTitle from "@/components/ui/HeaderTitle";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { InfiniteSlider } from "@/components/animations/infinite-slider";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { AnimatedButton, AnimatedTitle } from "@/components/animations/animated-component";
import { fadeInDown, fadeInLeft } from "@/hooks/use-scroll-animation";
import { ITestimonial } from "@/app/actions/testimonials";
interface ITestimonialsProps {
    testimonials?: ITestimonial[]
}
export default function Testimonials({ testimonials = [] }: ITestimonialsProps) {
    // Split testimonials into two halves
    const midpoint = Math.ceil(testimonials.length / 2);
    const firstHalf = testimonials?.slice(0, midpoint);
    const secondHalf = testimonials?.slice(midpoint);

    return <div id="testimonials"
        className={`flex lg:flex-row flex-col justify-center items-center w-full mt-24 h-max border-t-[0.1px] font-Poppins sm:pt-16 pt-8`}
    >
        <div className="font-Poppins flex flex-col lg:w-[92%] w-[90%]">
            <div className="flex w-full sm:gap-6 gap-4 flex-col">
                <AnimatedButton variants={fadeInDown}>
                    <HeaderTitle header={"Testimonials"} className="w-[120px]" />
                </AnimatedButton>
                <AnimatedTitle variants={fadeInLeft}>
                    <div className="w-full flex">
                        <div className="w-full sm:text-5xl text-3xl font-medium leading-[4.4rem] tracking-tight">
                            {`Trusted by clients who value quality and results.`}
                        </div>
                    </div>

                </AnimatedTitle>

                {/* First slider with first half of testimonials */}
                <InfiniteSlider speedOnHover={30} speed={70} gap={16} >
                    {firstHalf?.map((testimonial, index) => (
                        <Card key={`${testimonial.content}-${index}`} className="w-[28rem] h-60 flex-shrink-0 py-2 cursor-pointer ">
                            <CardContent className="p-6 h-full ">
                                <div className="flex flex-col h-full gap-4">
                                    {/* Rating Stars */}
                                    <BiSolidQuoteAltLeft size={30} className="text-[#364ee6]" />

                                    {/* Testimonial Content */}
                                    <blockquote className="text-sm text-muted-foreground  flex  items-center" >
                                        {`"${testimonial.content}"`}
                                    </blockquote>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-3">
                                        <Image
                                            height={48}
                                            width={48}
                                            src={`/api/images/testimonials/${testimonial.image}`}
                                            alt={`${testimonial.name} avatar`}
                                            className="h-12 w-12 object-cover rounded-full border flex-shrink-0"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-sm truncate">{testimonial.name}</div>
                                            <div className="text-xs text-muted-foreground truncate">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </InfiniteSlider>

                {/* Second slider with second half of testimonials (reverse direction) */}
                <InfiniteSlider speedOnHover={30} speed={70} gap={16} reverse >
                    {secondHalf?.map((testimonial, index) => (
                        <Card key={`${testimonial.content}-${index}`} className="w-[28rem] h-60 flex-shrink-0 py-2 cursor-pointer bg-[#f8fafb]">
                            <CardContent className="p-6 h-full ">
                                <div className="flex flex-col h-full gap-4">
                                    {/* Rating Stars */}
                                    <BiSolidQuoteAltLeft size={30} className="text-[#364ee6]" />

                                    {/* Testimonial Content */}
                                    <blockquote className="text-sm text-muted-foreground  flex  items-center" >
                                        {`"${testimonial.content}"`}
                                    </blockquote>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-3">
                                        <Image
                                            height={48}
                                            width={48}
                                            src={`/api/images/testimonials/${testimonial.image}`}
                                            alt={`${testimonial.name} avatar`}
                                            className="h-12 w-12 object-cover rounded-full border flex-shrink-0"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-sm truncate">{testimonial.name}</div>
                                            <div className="text-xs text-muted-foreground truncate">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                </InfiniteSlider>
            </div>
        </div>
    </div>
}