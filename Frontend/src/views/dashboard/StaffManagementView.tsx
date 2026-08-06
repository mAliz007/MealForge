import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rbacService } from "../../services/rbacService";
import { useAuthUser } from "../../hooks/useAuthUser";
import { UserPlus, ShieldPlus, Users, Key } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

import { StaffTable } from "../../components/staff/StaffTable";
import { RoleCardGrid } from "../../components/staff/RoleCardGrid";
import { AddStaffModal } from "../../components/staff/AddStaffModal";
import { CreateRoleModal } from "../../components/staff/CreateRoleModal";
import { FeedbackAlert } from "../../components/staff/FeedbackAlert";

export default function StaffManagementView() {
  const queryClient = useQueryClient();
  const { restaurantId } = useAuthUser();

  const [activeTab, setActiveTab] = useState<"staff" | "roles">("staff");
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // --- Queries ---
  const { data: staffList = [], isLoading: loadingStaff } = useQuery({
    queryKey: ["staff", restaurantId],
    queryFn: () => rbacService.getStaffMembers(restaurantId!),
    enabled: !!restaurantId,
  });

  const { data: rolesList = [], isLoading: loadingRoles } = useQuery({
    queryKey: ["roles", restaurantId],
    queryFn: () => rbacService.getRoles(restaurantId!),
    enabled: !!restaurantId,
  });

  const { data: permissionsCatalog = [], isLoading: loadingPermissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: rbacService.getPermissions,
  });

  // --- Mutations ---
  const createStaffMutation = useMutation({
    mutationFn: (payload: { name: string; email: string; password?: string; role_id: number }) =>
      rbacService.createStaffMember(restaurantId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", restaurantId] });
      setIsStaffModalOpen(false);
      setFeedback({ type: "success", msg: "Staff member added successfully!" });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        msg: err?.response?.data?.error || "Failed to add staff member.",
      });
    },
  });

  const revokeStaffMutation = useMutation({
    mutationFn: (membershipId: number) =>
      rbacService.revokeStaffMember(restaurantId!, membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", restaurantId] });
      setFeedback({ type: "success", msg: "Staff member access revoked." });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        msg: err?.response?.data?.error || "Failed to revoke staff access.",
      });
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: (payload: { name: string; permissions: string[] }) =>
      rbacService.createRole(restaurantId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", restaurantId] });
      setIsRoleModalOpen(false);
      setFeedback({ type: "success", msg: "Role created successfully!" });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        msg: err?.response?.data?.error || "Failed to create custom role.",
      });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: number) => rbacService.deleteRole(restaurantId!, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", restaurantId] });
      setFeedback({ type: "success", msg: "Custom role deleted successfully." });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        msg: err?.response?.data?.error || "Failed to delete role (it may be assigned to active staff).",
      });
    },
  });

  // --- Handlers ---
  const handleRevokeStaff = (membershipId: number, name: string) => {
    if (confirm(`Revoke access for ${name}?`)) {
      revokeStaffMutation.mutate(membershipId);
    }
  };

  const handleDeleteRole = (roleId: number, name: string) => {
    if (confirm(`Delete role "${name}"?`)) {
      deleteRoleMutation.mutate(roleId);
    }
  };

  if (loadingStaff || loadingRoles || loadingPermissions) {
    return <LoadingSpinner message="Loading management view..." />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            Staff & Role Management
          </h1>
          <p className="text-sm text-text-muted">
            Create custom roles with specific granular permissions and assign staff members to your restaurant.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <ShieldPlus className="h-4 w-4" />
            New Role
          </button>
          <button
            onClick={() => setIsStaffModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Feedback Alert Banner */}
      <FeedbackAlert feedback={feedback} onClear={() => setFeedback(null)} />

      {/* Navigation Tabs */}
      <div className="flex border-b border-text-muted/15 gap-8">
        <button
          onClick={() => setActiveTab("staff")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "staff"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-main"
          }`}
        >
          <Users className="h-4 w-4" />
          Staff Members ({staffList.length})
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "roles"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-main"
          }`}
        >
          <Key className="h-4 w-4" />
          Custom Roles ({rolesList.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "staff" && (
        <StaffTable
          staffList={staffList}
          onRevoke={handleRevokeStaff}
          isPending={revokeStaffMutation.isPending}
        />
      )}

      {activeTab === "roles" && (
        <RoleCardGrid
          rolesList={rolesList}
          onDeleteRole={handleDeleteRole}
          isPending={deleteRoleMutation.isPending}
        />
      )}

      {/* Modals */}
      <AddStaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        rolesList={rolesList}
        onSubmit={(data) => createStaffMutation.mutate(data)}
        isPending={createStaffMutation.isPending}
      />

      <CreateRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        permissionsCatalog={permissionsCatalog}
        onSubmit={(data) => createRoleMutation.mutate(data)}
        isPending={createRoleMutation.isPending}
      />
    </div>
  );
}