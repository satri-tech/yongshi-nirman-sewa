import { fetchTeamMembers } from "@/app/actions/teamMembers";
import Team from "@/features/team/client/components/Team";

export const revalidate = 3600;

export default async function TeamPage() {
    const response = await fetchTeamMembers();
    const teamMembers = response.data || [];

    return (
        <div className="flex flex-col gap-2 items-center">
            <Team teamMembers={teamMembers} showExploreMoreButton={false} showTopBorder={false} />
        </div>
    );
}
