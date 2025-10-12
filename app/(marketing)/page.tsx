import HeroSection from "@/components/layouts/hero-section/HeroSection";
import AboutUs from "@/components/layouts/about/AboutUs";
import Services from "@/components/layouts/services/Services";
import Team from "@/components/layouts/team/Team";
import Contact from "@/components/layouts/contact/contact";
import Testimonials from "@/components/layouts/testimonials/Testimonials";
import PortfolioComponent from "@/components/layouts/projects/Portfolio";
import { fetchProjects } from "../actions/fetchProjects";
import { fetchTestimonials } from "../actions/testimonials";
import { fetchTeamMembers } from "../actions/teamMembers";
import { fetchAboutUs } from "../actions/about";

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
