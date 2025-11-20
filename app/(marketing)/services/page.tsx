import Services from "@/features/services/components/Services";

export const revalidate = 3600;

export default async function ServicesPage() {
    return (
        <div className="flex flex-col gap-2 items-center">
            <Services showExploreMoreButton={false} showTopBorder={false} />
        </div>
    );
}
