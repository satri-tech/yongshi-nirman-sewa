import NavBar from "@/components/layouts/NavBar";
import Footer from "@/components/layouts/Footer";
import HeroSection from "@/components/layouts/HeroSection";
import StatsSection from "@/components/layouts/StatsSection";

export default function Home() {

  return (
    <div className=" flex flex-col gap-10">
      <NavBar />
      <HeroSection />
      <StatsSection />
      <Footer />
    </div>
  );
}
