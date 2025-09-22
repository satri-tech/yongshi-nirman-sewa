'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function AdminPage() {
    const [loading] = useState(true)

    return <div className="space-y-6">
        <div className="flex flex-col w-full  gap-8 justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h2>
            {
                loading ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 8 }, (_, i) => (
                        <LoadingCard key={i} />
                    ))}
                </div>
                    :

                    <Button variant="outline" size="sm" >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
            }
        </div>

    </div>
}


const LoadingCard = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
        </CardContent>
    </Card>
);
