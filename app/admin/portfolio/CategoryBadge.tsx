import { Badge } from "@/components/ui/badge";
import { Building, Home, Factory, Stethoscope, Wrench } from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
    Commercial: Building,
    Residential: Home,
    Industrial: Factory,
    Healthcare: Stethoscope,
    Renovation: Wrench,
};

interface CategoryBadgeProps {
    category: string;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
    const Icon = categoryIcons[category];
    return (
        <Badge className="py-1 px-3" variant={'outline'}>
            {Icon && <Icon className="w-3 h-3 mr-1" />}
            {category}
        </Badge>
    );
}
