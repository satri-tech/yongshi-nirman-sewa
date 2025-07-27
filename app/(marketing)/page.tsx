import HeroSection from "@/components/layouts/hero-section/HeroSection";
import AboutUs from "@/components/layouts/about/AboutUs";
import Portfolio from "@/components/layouts/portfolio/Portfolio";
import Services from "@/components/layouts/services/Services";
import Team from "@/components/layouts/team/Team";
import Contact from "@/components/layouts/contact/contact";
import Testimonials from "@/components/layouts/testimonials/Testimonials";

export default function Home() {
    return (
        <div className=" flex flex-col gap-2 items-center">
            <HeroSection />
            <AboutUs />
            <Services />
            <Portfolio />
            <Testimonials />
            <Team />
            <Contact />
        </div>
    );
}
