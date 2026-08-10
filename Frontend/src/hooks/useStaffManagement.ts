import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { rbacService } from "../services/rbacService";
import { useAuthUser } from "./useAuthUser";
import { useAlertStore } from "../store/useAlertStore";
import type { RoleItem } from "../components/staff/RoleCardGrid";

export function useStaffManagement() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);
  const { isAdmin, isOwner, hasPermission, restaurantId } = useAuthUser();

  const [activeTab, setActiveTab] = useState<"staff" | "roles">("staff");
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // --- Permissions ---
  const canManageStaff =
    isAdmin ||
    isOwner ||
    hasPermission("staff.manage", restaurantId) ||
    hasPermission("staff.create", restaurantId);

  const canManageRoles =
    isAdmin ||
    isOwner ||
    hasPermission("role.manage", restaurantId) ||
    hasPermission("role.create", restaurantId);

  const canReadRoles = canManageRoles || hasPermission("role.read", restaurantId);

  // --- Queries ---
  const { data: staffList = [], isLoading: loadingStaff } = useQuery({
    queryKey: ["staff", restaurantId],
    queryFn: () => rbacService.getStaffMembers(restaurantId!),
    enabled: !!restaurantId,
  });

  const { data: rolesList = [], isLoading: loadingRoles } = useQuery({
    queryKey: ["roles", restaurantId],
    queryFn: () => rbacService.getRoles(restaurantId!),
    enabled: !!restaurantId && canReadRoles,
  });

  const { data: permissionsCatalog = [], isLoading: loadingPermissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: rbacService.getPermissions,
    enabled: canManageRoles,
  });

  // --- Mutations ---
  const createStaffMutation = useMutation({
    mutationFn: (payload: { name: string; email: string; password?: string; role_id: number }) =>
      rbacService.createStaffMember(restaurantId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", restaurantId] });
      setIsStaffModalOpen(false);
      setFeedback({ type: "success", msg: t("staffManagement.alerts.addStaffSuccess") });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        msg: err?.response?.data?.error || t("staffManagement.alerts.addStaffError"),
      });
    },
  });

  const revokeStaffMutation = useMutation({
    mutationFn: (membershipId: number) =>
      rbacService.revokeStaffMember(restaurantId!, membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", restaurantId] });
      setFeedback({ type: "success", msg: t("staffManagement.alerts.revokeSuccess") });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        msg: err?.response?.data?.error || t("staffManagement.alerts.revokeError"),
      });
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: (payload: { name: string; permissions: string[] }) =>
      rbacService.createRole(restaurantId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", restaurantId] });
      setIsRoleModalOpen(false);
      setFeedback({ type: "success", msg: t("staffManagement.alerts.createRoleSuccess") });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        msg: err?.response?.data?.error || t("staffManagement.alerts.createRoleError"),
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ roleId, payload }: { roleId: number; payload: { name: string; permissions: string[] } }) =>
      rbacService.updateRole(restaurantId!, roleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setEditingRole(null);
      setFeedback({ type: "success", msg: t("staffManagement.alerts.updateRoleSuccess") });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        msg: err?.response?.data?.error || t("staffManagement.alerts.updateRoleError"),
      });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: number) => rbacService.deleteRole(restaurantId!, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", restaurantId] });
      setFeedback({ type: "success", msg: t("staffManagement.alerts.deleteRoleSuccess") });
    },
    onError: (err: any) => {
      setFeedback({
        type: "error",
        msg: err?.response?.data?.error || t("staffManagement.alerts.deleteRoleError"),
      });
    },
  });

  // --- Dialog Triggers ---
  const handleRevokeStaff = (membershipId: number, name: string) => {
    showAlert({
      title: t("staffManagement.revokeModal.title", "Revoke Staff Member"),
      message: t("staffManagement.confirmations.revoke", { name }),
      confirmText: t("common.actions.revoke", "Revoke"),
      cancelText: t("common.actions.cancel", "Cancel"),
      variant: "danger",
      onConfirm: async () => {
        await revokeStaffMutation.mutateAsync(membershipId);
      },
    });
  };

  const handleDeleteRole = (roleId: number, name: string) => {
    showAlert({
      title: t("staffManagement.deleteRoleModal.title", "Delete Role"),
      message: t("staffManagement.confirmations.deleteRole", { name }),
      confirmText: t("common.actions.delete", "Delete"),
      cancelText: t("common.actions.cancel", "Cancel"),
      variant: "danger",
      onConfirm: async () => {
        await deleteRoleMutation.mutateAsync(roleId);
      },
    });
  };

  const handleUpdateRoleSubmit = (
    roleId: number,
    payload: { name: string; permissions: string[] }
  ) => {
    updateRoleMutation.mutate({ roleId, payload });
  };

  const isLoading = loadingStaff || loadingRoles || (canManageRoles && loadingPermissions);

  return {
    state: {
      activeTab,
      isStaffModalOpen,
      isRoleModalOpen,
      editingRole,
      feedback,
      staffList,
      rolesList,
      permissionsCatalog,
      canManageStaff,
      canManageRoles,
      canReadRoles,
      isLoading,
      isRevokePending: revokeStaffMutation.isPending,
      isDeleteRolePending: deleteRoleMutation.isPending || updateRoleMutation.isPending,
      isCreateStaffPending: createStaffMutation.isPending,
      isCreateRolePending: createRoleMutation.isPending,
      isUpdateRolePending: updateRoleMutation.isPending,
    },
    actions: {
      setActiveTab,
      setIsStaffModalOpen,
      setIsRoleModalOpen,
      setEditingRole,
      setFeedback,
      handleRevokeStaff,
      handleDeleteRole,
      handleUpdateRoleSubmit,
      createStaff: createStaffMutation.mutate,
      createRole: createRoleMutation.mutate,
    },
  };
}