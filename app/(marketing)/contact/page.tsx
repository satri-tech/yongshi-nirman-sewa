import Contact from "@/features/contact/client/components/contact";

export const revalidate = 3600;

export default async function ContactPage() {
    return (
        <div className="flex flex-col gap-2 items-center">
            <Contact showExploreMoreButton={false} showTopBorder={false} />
        </div>
    );
}
