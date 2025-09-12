import PortfolioComponent from "@/components/layouts/portfolio/Portfolio";

export default function Portfolios() {
    return <div className=" flex flex-col gap-2 items-center">
        <PortfolioComponent  showExploreMoreButton={false} showTopBorder={false} />
    </div>
}