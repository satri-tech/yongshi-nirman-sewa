'use client';

import { AnimatedButton, AnimatedTitle, AnimationWrapper } from '@/components/animations/animated-component';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card';
import HeaderTitle from '@/components/ui/HeaderTitle'
import Map from '@/components/ui/Map'
import { fadeInDown, fadeInLeft, staggerItem } from '@/hooks/use-scroll-animation';
import { SendHorizontal, MapPin, Phone, Mail, Loader2 } from 'lucide-react'
import { BsGithub, BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs';
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { useState } from 'react';
import { createContact } from '@/app/actions/contact';
import { toast } from 'sonner';

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    message: string;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    message?: string;
    general?: string;
}

export default function Contact() {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Use createContactDirect and pass the form data object directly
            const result = await createContact(formData);

            if (result.success) {
                toast.success("Thank you for your message! We'll get back to you soon.")
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    message: ''
                });
                setErrors({});
            } else {
                setErrors({
                    general: result.message || 'Something went wrong. Please try again.'
                });
            }
        } catch {
            setErrors({
                general: 'Something went wrong. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div id="contact"
            className={`flex lg:flex-row flex-col justify-center items-center w-full mt-24 h-max border-t-[0.1px] font-Poppins sm:pt-16 pt-8`}
        >
            <div className="font-Poppins flex flex-col  lg:w-[92%] w-[90%] ">
                <div className="flex w-full sm:gap-6 gap-4 flex-col ">
                    <AnimatedButton variants={fadeInDown}>
                        <HeaderTitle header={"Contact"} />
                    </AnimatedButton>
                    <AnimatedTitle variants={fadeInLeft}>
                        <div className="w-full flex">
                            <div className="w-full sm:text-5xl text-3xl font-medium leading-[4.4rem] tracking-tight">
                                Any question? We would be happy to help you!
                            </div>
                        </div>
                    </AnimatedTitle>

                    <div className='flex pt-10 flex-col lg:flex-col gap-8'>
                        {/* Contact Form */}
                        <div className='flex gap-8'>
                            <AnimationWrapper className='w-full lg:w-8/12' variants={staggerItem}>
                                <Card className="flex flex-col p-6  rounded-lg gap-2 w-full  font-Poppins">
                                    <h3 className="text-xl  font-semibold mb-4 border-b pb-4">Get in Touch</h3>
                                    {/* Error Message */}
                                    {errors.general && (
                                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
                                            {errors.general}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="flex flex-col md:flex-row text-xs justify-between gap-4 ">
                                            <div className="flex flex-col gap-1 w-full">
                                                <label htmlFor="fullName">Full Name</label>
                                                <input
                                                    type="text"
                                                    id="fullName"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your name"
                                                    className={`placeholder:text-xs text-xs w-full border-2 h-12 rounded-md focus:outline-none pl-4 font-Poppins font-normal tracking-wide ${errors.fullName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                        }`}
                                                />
                                                {errors.fullName && (
                                                    <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 w-full">
                                                <label htmlFor="email">Your Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your email"
                                                    className={`placeholder:text-xs w-full border-2 h-12 rounded-md focus:outline-none pl-4 text-xs font-Poppins font-normal tracking-wide ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                        }`}
                                                />
                                                {errors.email && (
                                                    <span className="text-red-500 text-xs mt-1">{errors.email}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 w-full text-xs">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Your Phone Number"
                                                className="placeholder:text-xs w-full border-2 h-12 rounded-md focus:outline-none pl-4 text-xs font-Poppins font-normal tracking-wide border-gray-300 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1 w-full text-xs">
                                            <label htmlFor="message">MESSAGE</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                placeholder="Write some message for us"
                                                className={`placeholder:text-xs w-full border-2 focus:outline-none p-4 text-xs font-Poppins tracking-wide font-normal rounded-md h-32 ${errors.message ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                    }`}
                                            />
                                            {errors.message && (
                                                <span className="text-red-500 text-xs mt-1">{errors.message}</span>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className='py-5 ml-auto rounded-sm px-8 disabled:opacity-50'
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send <SendHorizontal className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            </AnimationWrapper>

                            <div className="w-full lg:w-1/2 space-y-6">
                                <AnimationWrapper >
                                    <div className="dark:bg-gray-800 rounded-lg p-4 border">
                                        <h3 className="text-xl font-semibold mb-6 border-b pb-2">Contact Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="text-gray-600 w-5 h-5" />
                                                <div>
                                                    <p className="font-medium">Address</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">Shishuwa, Pokhara, Nepal</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="text-gray-600 w-5 h-5" />
                                                <div>
                                                    <p className="font-medium">Phone</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">+977 123 456 7890</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="text-gray-600 w-5 h-5" />
                                                <div>
                                                    <p className="font-medium">Email</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">info@yongshi-nirman.com</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AnimationWrapper>

                                <AnimationWrapper >
                                    <div className="dark:bg-gray-800 rounded-lg p-4 border">
                                        <h3 className="text-xl font-semibold mb-6 border-b pb-2">Follow Us</h3>

                                        <div className="flex flex-wrap gap-4">
                                            {/* Facebook */}
                                            <Button
                                                size={'icon'}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                            >
                                                <FaFacebookF size={20} />
                                            </Button>

                                            {/* Twitter/X */}
                                            <Button
                                                size={'icon'}
                                                className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-200"
                                            >
                                                <BsTwitter size={20} />
                                            </Button>

                                            {/* Instagram */}
                                            <Button
                                                size={'icon'}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200"
                                            >
                                                <BsInstagram size={20} />
                                            </Button>

                                            {/* YouTube */}
                                            <Button
                                                size={'icon'}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                                            >
                                                <BsYoutube size={20} />
                                            </Button>

                                            {/* LinkedIn */}
                                            <Button
                                                size={'icon'}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white transition-colors duration-200"
                                            >
                                                <FaLinkedinIn size={20} />
                                            </Button>

                                            {/* GitHub */}
                                            <Button
                                                size={'icon'}
                                            >
                                                <BsGithub size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </AnimationWrapper>
                            </div>
                        </div>

                        <AnimatedTitle>
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Find Us Here</h3>
                                <Map className="w-full" />
                            </div>
                        </AnimatedTitle>
                    </div>
                </div>
            </div>
        </div>
    )
}