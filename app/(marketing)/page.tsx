import AboutUs from "@/features/about-us/client/components/AboutUs";
import Team from "@/features/team/client/components/Team";
import Contact from "@/features/contact/client/components/contact";
import Testimonials from "@/features/testimonials/client/components/Testimonials";
import PortfolioComponent from "@/features/projects/client/components/Portfolio";
import { fetchProjects } from "../actions/fetchProjects";
import { fetchTestimonials } from "../actions/testimonials";
import { fetchTeamMembers } from "../actions/teamMembers";
import { fetchAboutUs } from "../actions/about";
import HeroSection from "@/features/hero-section/client/components/HeroSection";
import Services from "@/features/services/components/Services";

export const revalidate = 3600;

export default async function Home() {
    const [projectResponse, testimonialsResponse, teamMembersResponse, aboutUsResponse] = await Promise.all([
        fetchProjects(),
        fetchTestimonials(),
        fetchTeamMembers(),
        fetchAboutUs()
    ])
    console.log(aboutUsResponse)
    return (
        <div className=" flex flex-col sm:gap-2  items-center">
            <HeroSection />
            <AboutUs aboutUsData={aboutUsResponse.data} />
            <Services />
            <PortfolioComponent projectsdata={projectResponse.data} />
            <Testimonials testimonials={testimonialsResponse.data} />
            <Team teamMembers={teamMembersResponse.data} />
            <Contact />
        </div>
    );
}
