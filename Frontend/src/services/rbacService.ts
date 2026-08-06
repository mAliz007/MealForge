import { apiClient } from "./apiClient"; // adjust path if apiClient is exported from another file
import type { Permission, CustomRole, StaffMember } from "../types/auth";

export const rbacService = {
    // 1. Fetch available permissions catalog
    getPermissions: async (): Promise<Permission[]> => {
        const response = await apiClient.get<{ permissions: Permission[] }>("/v1/permissions");
        return response.data.permissions ?? response.data;
    },

    // 2. Fetch roles for a restaurant
    getRoles: async (restaurantId: number): Promise<CustomRole[]> => {
        const response = await apiClient.get<{ roles: CustomRole[] }>(
            `/v1/restaurants/${restaurantId}/roles`
        );
        return response.data.roles ?? response.data;
    },

    // 3. Create a custom role
    createRole: async (
        restaurantId: number,
        payload: { name: string; permissions: string[] }
    ): Promise<CustomRole> => {
        const response = await apiClient.post(`/v1/restaurants/${restaurantId}/roles`, {
            role: payload,
        });
        return response.data;
    },

    // 4. Fetch staff members for a restaurant
    getStaffMembers: async (restaurantId: number): Promise<StaffMember[]> => {
        const response = await apiClient.get<{ staff: StaffMember[] }>(
            `/v1/restaurants/${restaurantId}/staff`
        );
        return response.data.staff ?? response.data;
    },

    // 5. Create / assign a new staff member
    createStaffMember: async (
        restaurantId: number,
        payload: { name: string; email: string; password?: string; role_id: number }
    ): Promise<StaffMember> => {
        const response = await apiClient.post(`/v1/restaurants/${restaurantId}/staff`, payload);
        return response.data;
    },

    // Revoke staff membership
    revokeStaffMember: async (restaurantId: number, membershipId: number): Promise<void> => {
        await apiClient.delete(`/v1/restaurants/${restaurantId}/staff/${membershipId}`);
    },

    // Delete custom role
    deleteRole: async (restaurantId: number, roleId: number): Promise<void> => {
        await apiClient.delete(`/v1/restaurants/${restaurantId}/roles/${roleId}`);
    },
};