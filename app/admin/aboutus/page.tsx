export const dynamic = "force-dynamic"

import { fetchAboutUs } from "@/app/actions/about";
import UpdateAboutUsComponent from "./UpdateAboutUs";

export default async function AboutUsAdmin() {
    const result = await fetchAboutUs();
    if (!result.success) {
        return <div>Error fetching Data</div>
    }

    return (
        <div className="min-h-screen py-2">
            <div className="w-full px-2">
                <div className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">About Us Management</h1>
                            <p className="mt-2">
                                Edit your company&apos;s about section content. Changes will be reflected on the website after saving.
                            </p>
                        </div>
                    </div>
                </div>

                <UpdateAboutUsComponent data={result.data} />
            </div>
        </div>
    );
}