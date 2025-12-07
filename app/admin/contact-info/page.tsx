export const dynamic = "force-dynamic"

import { fetchContactInfo } from "@/app/actions/contact-info";
import UpdateContactInfoComponent from "@/features/contact/admin/components/UpdateContactInfo";

export default async function ContactInfoAdmin() {
    const result = await fetchContactInfo();

    return (
        <div className="min-h-screen py-2">
            <div className="w-full sm:px-2">
                <div className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="sm:text-3xl text-2xl font-bold">Contact Information Management</h1>
                            <p className="mt-2">
                                Update your contact details and social media links. Changes will be reflected on the website after saving.
                            </p>
                        </div>
                    </div>
                </div>

                <UpdateContactInfoComponent data={result.data} />
            </div>
        </div>
    );
}
