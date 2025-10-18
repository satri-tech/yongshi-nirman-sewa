import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/card";
// Helper Components
interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description?: string;
    growth?: React.ReactNode;
}

export default function StatsCard({ title, value, icon, description, growth }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center justify-between">
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                    {growth && <div className="text-xs">{growth}</div>}
                </div>
            </CardContent>
        </Card>
    )
}
