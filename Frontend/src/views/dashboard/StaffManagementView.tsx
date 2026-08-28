import { useTranslation } from "react-i18next";
import { UserPlus, ShieldPlus, Users, Key } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { StaffTable } from "../../components/staff/StaffTable";
import { RoleCardGrid } from "../../components/staff/RoleCardGrid";
import { AddStaffModal } from "../../components/staff/AddStaffModal";
import { CreateRoleModal } from "../../components/staff/CreateRoleModal";
import { EditRoleModal } from "../../components/staff/EditRoleModal";
import { FeedbackAlert } from "../../components/staff/FeedbackAlert";
import { useStaffManagement } from "../../hooks/useStaffManagement";

export default function StaffManagementView() {
  const { t } = useTranslation();
  const { state, actions } = useStaffManagement();

  if (state.isLoading) {
    return <LoadingSpinner message={t("staffManagement.loading")} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            {t("staffManagement.title")}
          </h1>
          <p className="text-sm text-text-muted">
            {t("staffManagement.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {state.canManageRoles && (
            <button
              onClick={() => actions.setIsRoleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <ShieldPlus className="h-4 w-4" />
              {t("staffManagement.newRole")}
            </button>
          )}

          {state.canManageStaff && (
            <button
              onClick={() => actions.setIsStaffModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary hover:opacity-90 rounded-lg transition-all active:scale-[0.98]"
            >
              <UserPlus className="h-4 w-4" />
              {t("staffManagement.addStaff")}
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alert Banner */}
      <FeedbackAlert feedback={state.feedback} onClear={() => actions.setFeedback(null)} />

      {/* Navigation Tabs */}
      <div className="flex border-b border-text-muted/15 gap-8">
        <button
          onClick={() => actions.setActiveTab("staff")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            state.activeTab === "staff"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-main"
          }`}
        >
          <Users className="h-4 w-4" />
          {t("staffManagement.tabs.staff", { count: state.staffList.length })}
        </button>

        {state.canReadRoles && (
          <button
            onClick={() => actions.setActiveTab("roles")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              state.activeTab === "roles"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-main"
            }`}
          >
            <Key className="h-4 w-4" />
            {t("staffManagement.tabs.roles", { count: state.rolesList.length })}
          </button>
        )}
      </div>

      {/* Tab Panels */}
      {state.activeTab === "staff" && (
        <StaffTable
          staffList={state.staffList}
          onRevoke={actions.handleRevokeStaff}
          isPending={state.isRevokePending}
          canManage={state.canManageStaff}
        />
      )}

      {state.activeTab === "roles" && state.canReadRoles && (
        <RoleCardGrid
          rolesList={state.rolesList}
          onEditRole={(role) => actions.setEditingRole(role)}
          onDeleteRole={actions.handleDeleteRole}
          isPending={state.isDeleteRolePending}
          canManage={state.canManageRoles}
        />
      )}

      {/* Modals */}
      {state.canManageStaff && (
        <AddStaffModal
          isOpen={state.isStaffModalOpen}
          onClose={() => actions.setIsStaffModalOpen(false)}
          rolesList={state.rolesList}
          onSubmit={(data) => actions.createStaff(data)}
          isPending={state.isCreateStaffPending}
        />
      )}

      {state.canManageRoles && (
        <>
          <CreateRoleModal
            isOpen={state.isRoleModalOpen}
            onClose={() => actions.setIsRoleModalOpen(false)}
            permissionsCatalog={state.permissionsCatalog}
            onSubmit={(data) => actions.createRole(data)}
            isPending={state.isCreateRolePending}
          />

          <EditRoleModal
            isOpen={!!state.editingRole}
            onClose={() => actions.setEditingRole(null)}
            role={state.editingRole}
            permissionsCatalog={state.permissionsCatalog}
            onSubmit={actions.handleUpdateRoleSubmit}
            isPending={state.isUpdateRolePending}
          />
        </>
      )}
    </div>
  );
}