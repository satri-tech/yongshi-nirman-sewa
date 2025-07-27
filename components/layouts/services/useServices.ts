"use client";
import { useState } from "react";
import { servicesData } from "./constants";

export const useServices = () => {
  const [activeService, setActiveService] = useState<number | null>(null);

  const handleServiceClick = (index: number) => {
    setActiveService(activeService === index ? null : index);
  };

  // Determine the image to display, defaulting to the last image if no service is selected
  const activeImage =
    activeService !== null
      ? servicesData[activeService].image
      : servicesData[servicesData.length - 1].image;

  return { activeService, activeImage, handleServiceClick };
};
