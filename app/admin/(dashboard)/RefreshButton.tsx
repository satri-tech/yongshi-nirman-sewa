'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function RefreshButton() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        
        try {
            // Force a router refresh to re-fetch server-side data
            router.refresh();
        } finally {
            // Add a small delay to show the loading state
            setTimeout(() => {
                setIsRefreshing(false);
            }, 1000);
        }
    };

    return (
        <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
        >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
        </Button>
    );
}