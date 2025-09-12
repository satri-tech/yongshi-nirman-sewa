import Link from "next/link";
import { fetchProjectById } from "@/app/actions/fetchProjects";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import EachProductDetails from "./EachProductDetails";

export const revalidate = 3600;

export default async function EachPortfolioDetails({ params }: { params: Promise<{ id: string }> }) {
    const response = await fetchProjectById((await params).id)
    const data = response.data;
    if (!response.success) {
        return (
            <div className="w-full flex justify-center h-screen">
                <div className="w-[90%] h-full flex flex-col md:flex-row gap-5 mt-4">
                    Error Fetching Data
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">

            <div className="w-[90%] text-secondary-text font-medium text-sm flex items-center ">
                <Breadcrumb className="mr-auto">
                    <BreadcrumbList>
                        <BreadcrumbItem className="dark:text-white text-neutral-800 hover:underline">
                            <Link href="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="dark:text-white text-neutral-800 hover:underline">
                                <Link href={'/projects'}>Projects</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>
                                {data?.title}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <EachProductDetails data={data} />
        </div >
    );
}
