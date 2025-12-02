import Contact from "@/features/contact/client/components/contact";
import { fetchContactInfo } from "@/app/actions/contact-info";

export const revalidate = 3600;

export default async function ContactPage() {
    const result = await fetchContactInfo();
    
    return (
        <div className="flex flex-col gap-2 items-center">
            <Contact showExploreMoreButton={false} showTopBorder={false} contactInfo={result.data} />
        </div>
    );
}
