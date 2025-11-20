import { fetchAboutUs } from "@/app/actions/about";
import AboutUs from "@/features/about-us/client/components/AboutUs";

export const revalidate = 3600;

export default async function AboutPage() {
    const response = await fetchAboutUs();
    
    if (!response.success) {
        return <div>Error fetching about us data</div>;
    }

    return (
        <div className="flex flex-col gap-2 items-center">
            <AboutUs aboutUsData={response.data} showTopBorder={false} />
        </div>
    );
}
