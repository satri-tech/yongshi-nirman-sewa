import HeroSection from "@/components/layouts/hero-section/HeroSection";
import AboutUs from "@/components/layouts/about/AboutUs";
import Services from "@/components/layouts/services/Services";
import Team from "@/components/layouts/team/Team";
import Contact from "@/components/layouts/contact/contact";
import Testimonials from "@/components/layouts/testimonials/Testimonials";
import PortfolioComponent from "@/components/layouts/portfolio/Portfolio";
import { fetchProjects } from "../actions/fetchProjects";


export const revalidate = 3600;

export default async function Home() {
    const response = await fetchProjects(); // fetch server-side
    const projectsdata = response.data;

    return (
        <div className=" flex flex-col gap-2 items-center">
            <HeroSection />
            <AboutUs />
            <Services />
            <PortfolioComponent projectsdata={projectsdata} />
            <Testimonials />
            <Team />
            <Contact />
        </div>
    );
}
