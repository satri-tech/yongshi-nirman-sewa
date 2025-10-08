// Add these type definitions to your page.tsx or create a separate types file

import { IProject } from "@/app/actions/fetchProjects";

export interface MonthlyProjectStat {
  month: Date;
  count: number;
  status: "Completed" | "InProgress" | "OnHold" | "Pending";
}

export interface MonthlyContactStat {
  month: Date;
  count: number;
}

export interface RecentContact {
  id: string;
  fullName: string;
  email: string;
  message: string;
  createdAt: Date;
}

// Update the DashboardData interface in page.tsx
export interface DashboardData {
  overview: {
    totalProjects: number;
    totalContacts: number;
    totalTestimonials: number;
    totalTeamMembers: number;
    activeTeamMembers: number;
    averageRating: number;
  };
  projects: {
    statusCounts: {
      Completed: number;
      InProgress: number;
      OnHold: number;
      Pending: number;
    };
    recentProjects: IProject[];
    monthlyStats: MonthlyProjectStat[]; // Changed from any[]
    growth: {
      last30Days: number;
      previous30Days: number;
    };
  };
  contacts: {
    total: number;
    recentContacts: RecentContact[]; // Changed from any[]
    monthlyStats: MonthlyContactStat[]; // Changed from any[]
    growth: {
      last30Days: number;
      previous30Days: number;
    };
  };
  team: {
    total: number;
    active: number;
    inactive: number;
  };
  testimonials: {
    total: number;
    averageRating: number;
  };
}
