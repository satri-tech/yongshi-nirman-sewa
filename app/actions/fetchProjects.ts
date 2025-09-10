"use server";

import { prisma } from "@/lib/prisma";

export interface IProject {
  id: string;
  title: string;
  description: string;
  location: string;
  client: string | null;
  area: string;
  status: "Completed" | "InProgress" | "OnHold" | "Pending";
  startDate: Date | null;
  endDate: Date | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "Completed" | "InProgress" | "OnHold" | "Pending" | "All";
  sortBy?: "createdAt" | "title" | "status" | "startDate" | "endDate";
  sortOrder?: "asc" | "desc";
}

export interface IProjectsResponse {
  success: boolean;
  data: IProject[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  error?: string;
}

// Main function to fetch all projects with pagination and filtering
export async function fetchProjects(
  params: IPaginationParams = {}
): Promise<IProjectsResponse> {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "All",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    // Validate pagination parameters
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(Math.max(1, limit), 50); // Max 50 items per page
    const skip = (validatedPage - 1) * validatedLimit;

    // Build where clause for filtering
    const whereClause: any = {};

    // Search functionality
    if (search && search.trim()) {
      whereClause.OR = [
        {
          title: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          client: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    // Status filtering
    if (status !== "All") {
      whereClause.status = status;
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    console.log("Fetching projects with params:", {
      page: validatedPage,
      limit: validatedLimit,
      search,
      status,
      sortBy,
      sortOrder,
    });

    // Fetch projects and total count in parallel
    const [projects, totalCount] = await Promise.all([
      prisma.portfolio.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: validatedLimit,
      }),
      prisma.portfolio.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / validatedLimit);
    const hasNextPage = validatedPage < totalPages;
    const hasPreviousPage = validatedPage > 1;

    console.log(
      `Successfully fetched ${projects.length} projects out of ${totalCount} total`
    );

    return {
      success: true,
      data: projects,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      switch ((error as any).code) {
        case "P1001":
          return {
            success: false,
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              totalCount: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
            error: "Database connection failed",
          };
        case "P2025":
          return {
            success: false,
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              totalCount: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
            error: "Database table not found",
          };
        default:
          console.error("Prisma error:", error);
      }
    }

    return {
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error:
        error instanceof Error ? error.message : "Failed to fetch projects",
    };
  }
}

// Fetch a single project by ID
export async function fetchProjectById(id: string): Promise<{
  success: boolean;
  data?: IProject;
  error?: string;
}> {
  try {
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "Project ID is required",
      };
    }

    console.log(`Fetching project with ID: ${id}`);

    const project = await prisma.portfolio.findUnique({
      where: {
        id: id.trim(),
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    console.log(`Successfully fetched project: ${project.title}`);

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("Error fetching project by ID:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch project",
    };
  }
}

// Get projects by status
export async function fetchProjectsByStatus(
  status: "Completed" | "InProgress" | "OnHold" | "Pending"
): Promise<IProjectsResponse> {
  return fetchProjects({ status, limit: 50 });
}

// Get recent projects (last 10)
export async function fetchRecentProjects(): Promise<IProjectsResponse> {
  return fetchProjects({
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
}

// Get project statistics
export async function fetchProjectStats(): Promise<{
  success: boolean;
  data?: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    onHold: number;
    totalArea: number;
    averageArea: number;
  };
  error?: string;
}> {
  try {
    console.log("Fetching project statistics...");

    const [total, completed, inProgress, pending, onHold, allProjects] =
      await Promise.all([
        prisma.portfolio.count(),
        prisma.portfolio.count({ where: { status: "Completed" } }),
        prisma.portfolio.count({ where: { status: "InProgress" } }),
        prisma.portfolio.count({ where: { status: "Pending" } }),
        prisma.portfolio.count({ where: { status: "OnHold" } }),
        prisma.portfolio.findMany({ select: { area: true } }),
      ]);

    // Calculate area statistics
    const areas = allProjects
      .map((project) => parseFloat(project.area))
      .filter((area) => !isNaN(area) && area > 0);

    const totalArea = areas.reduce((sum, area) => sum + area, 0);
    const averageArea = areas.length > 0 ? totalArea / areas.length : 0;

    const stats = {
      total,
      completed,
      inProgress,
      pending,
      onHold,
      totalArea: Math.round(totalArea * 100) / 100, // Round to 2 decimal places
      averageArea: Math.round(averageArea * 100) / 100,
    };

    console.log("Project statistics:", stats);

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Error fetching project statistics:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch project statistics",
    };
  }
}

// Search projects by title, description, location, or client
export async function searchProjects(
  query: string,
  limit: number = 20
): Promise<IProjectsResponse> {
  if (!query || query.trim() === "") {
    return {
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error: "Search query is required",
    };
  }

  return fetchProjects({
    search: query,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
}
