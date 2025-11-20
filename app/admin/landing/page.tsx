import Landing from "@/features/landing/admin/components/page";

export const dynamic = "force-dynamic"


export default async function LandingPage() {


    return (
        <div className="min-h-screen py-2">
            <div className="w-full sm:px-2">
                <div className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="sm:text-3xl text-2xl font-bold">Landing Page Management</h1>
                            <p className="mt-2">
                                Manage and update the landing page settings. You can edit the landing title, description, and upload or modify the slider images displayed on the homepage.
                            </p>
                        </div>
                    </div>
                </div>

                <Landing />
            </div>
        </div>
    );
}