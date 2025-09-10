import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Hammer } from "lucide-react";
const statusIcons: Record<string, React.ElementType> = {
    Completed: CheckCircle,
    Progress: Hammer,
    Planning: Clock,
};

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const Icon = statusIcons[status];
    return (
        <Badge className="py-1 px-3" variant={'secondary'}>
            {Icon && <Icon className="w-3 h-3 mr-1" />}
            {status}
        </Badge>
    );
}