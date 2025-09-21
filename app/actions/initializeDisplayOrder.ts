"use server";

import { prisma } from "@/lib/prisma";

export async function initializeDisplayOrders() {
    try {
        // Get all team members ordered by their current displayOrder (nulls last)
        const teamMembers = await prisma.team.findMany({
            orderBy: [
                { displayOrder: 'asc' },
                { createdAt: 'asc' }
            ]
        });

        // Check if initialization is needed
        const needsInitialization = teamMembers.some(
            member => member.displayOrder === null || 
            teamMembers.filter(m => m.displayOrder === member.displayOrder).length > 1
        );

        if (!needsInitialization) {
            return { 
                success: true, 
                message: "Display orders are already properly initialized" 
            };
        }

        // Use transaction to update all at once
        await prisma.$transaction(
            teamMembers.map((member, index) => 
                prisma.team.update({
                    where: { id: member.id },
                    data: { displayOrder: index + 1 }
                })
            )
        );

        return { 
            success: true, 
            message: `Initialized display orders for ${teamMembers.length} team members` 
        };
    } catch (error) {
        console.error("Error initializing display orders:", error);
        return { 
            success: false, 
            error: "Failed to initialize display orders" 
        };
    }
}
