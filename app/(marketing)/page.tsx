import HeroSection from "@/components/layouts/hero-section/HeroSection";
import AboutUs from "@/components/layouts/about/AboutUs";
import Services from "@/components/layouts/services/Services";
import Team from "@/components/layouts/team/Team";
import Contact from "@/components/layouts/contact/contact";
import Testimonials from "@/components/layouts/testimonials/Testimonials";
import PortfolioComponent from "@/components/layouts/portfolio/Portfolio";
import { fetchProjects } from "../actions/fetchProjects";
import { fetchTestimonials } from "../actions/testimonials";

export const revalidate = 3600;

export default async function Home() {
    const [projectResponse, testimonialsResponse] = await Promise.all([
        fetchProjects(),
        fetchTestimonials()
    ])

    return (
        <div className=" flex flex-col gap-2 items-center">
            <HeroSection />
            <AboutUs />
            <Services />
            <PortfolioComponent projectsdata={projectResponse.data} />
            <Testimonials testimonials={testimonialsResponse.data} />
            <Team />
            <Contact />
        </div>
    );
}
