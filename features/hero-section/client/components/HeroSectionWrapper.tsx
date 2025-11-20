'use client'

import HeroSection from "./HeroSection";

interface HeroSectionWrapperProps {
  landingData?: {
    id: string;
    title: string;
    description: string;
    sliderImages: string[];
    createdAt: Date | string;
    updatedAt: Date | string;
  } | null;
}

export default function HeroSectionWrapper({ landingData }: HeroSectionWrapperProps) {
  // Convert Date to string if needed
  const normalizedData = landingData ? {
    ...landingData,
    createdAt: typeof landingData.createdAt === 'string' ? landingData.createdAt : landingData.createdAt.toISOString(),
    updatedAt: typeof landingData.updatedAt === 'string' ? landingData.updatedAt : landingData.updatedAt.toISOString(),
  } : null;

  return <HeroSection landingData={normalizedData} />;
}
