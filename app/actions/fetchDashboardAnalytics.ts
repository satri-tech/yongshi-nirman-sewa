"use server";

import { prisma } from "@/lib/prisma";

export async function fetchDashboardAnalytics() {
  try {
    // Fetch all data in parallel for better performance
    const [
      totalProjects,
      projectsByStatus,
      recentProjects,
      totalContacts,
      recentContacts,
      totalTestimonials,
      averageRating,
      totalTeamMembers,
      activeTeamMembers,
      monthlyProjectStats,
      monthlyContactStats,
    ] = await Promise.all([
      // Total projects count
      prisma.portfolio.count(),

      // Projects grouped by status
      prisma.portfolio.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      }),

      // Recent projects (last 5)
      prisma.portfolio.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          status: true,
          client: true,
          location: true,
          createdAt: true,
          area: true,
          images: true,
        },
      }),

      // Total contact messages
      prisma.contactUs.count(),

      // Recent contact messages (last 5)
      prisma.contactUs.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          message: true,
          createdAt: true,
        },
      }),

      // Total testimonials
      prisma.testimonial.count(),

      // Average rating from testimonials
      prisma.testimonial.aggregate({
        _avg: {
          rating: true,
        },
      }),

      // Total team members
      prisma.team.count(),

      // Active team members
      prisma.team.count({
        where: {
          isActive: true,
        },
      }),

      // Monthly project statistics (last 12 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::int as count,
          status
        FROM "Portfolio" 
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "createdAt"), status
        ORDER BY month DESC
      `,

      // Monthly contact statistics (last 12 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::int as count
        FROM "ContactUs" 
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `,
    ]);

    // Process project status data
    const statusCounts = {
      Completed: 0,
      InProgress: 0,
      OnHold: 0,
      Pending: 0,
    };

    projectsByStatus.forEach((item) => {
      statusCounts[item.status] = item._count.id;
    });

    // Calculate growth metrics (comparing last 30 days with previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [
      recentProjectsCount,
      previousProjectsCount,
      recentContactsCount,
      previousContactsCount,
    ] = await Promise.all([
      prisma.portfolio.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.portfolio.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
      prisma.contactUs.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.contactUs.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        // Overview metrics
        overview: {
          totalProjects,
          totalContacts,
          totalTestimonials,
          totalTeamMembers,
          activeTeamMembers,
          averageRating: averageRating._avg.rating
            ? parseFloat(averageRating._avg.rating.toFixed(1))
            : 0,
        },

        // Project analytics
        projects: {
          statusCounts,
          recentProjects,
          monthlyStats: monthlyProjectStats,
          growth: {
            last30Days: recentProjectsCount,
            previous30Days: previousProjectsCount,
          },
        },

        // Contact analytics
        contacts: {
          total: totalContacts,
          recentContacts,
          monthlyStats: monthlyContactStats,
          growth: {
            last30Days: recentContactsCount,
            previous30Days: previousContactsCount,
          },
        },

        // Team analytics
        team: {
          total: totalTeamMembers,
          active: activeTeamMembers,
          inactive: totalTeamMembers - activeTeamMembers,
        },

        // Testimonial analytics
        testimonials: {
          total: totalTestimonials,
          averageRating: averageRating._avg.rating
            ? parseFloat(averageRating._avg.rating.toFixed(1))
            : 0,
        },
      },
    };
  } catch (error: unknown) {
    console.error("Dashboard analytics fetch error:", error);
    // Type guard function
    const getErrorMessage = (error: unknown): string => {
      if (error instanceof Error) return error.message;
      if (typeof error === "string") return error;
      return "An unknown error occurred";
    };
    return {
      success: false,
      message: "Failed to fetch dashboard analytics. Please try again.",
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : undefined,
    };
  } finally {
    await prisma.$disconnect();
  }
}
