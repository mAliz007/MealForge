import { Trash2, Edit2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PermissionsBadgeGrid } from "./PermissionsBadgeGrid";

export interface RoleItem {
  id: number;
  name: string;
  system_key?: string | null;
  permissions: string[];
}

interface RoleCardGridProps {
  rolesList: RoleItem[];
  onEditRole?: (role: RoleItem) => void;
  onDeleteRole: (roleId: number, roleName: string) => void;
  isPending?: boolean;
  canManage?: boolean;
}

export function RoleCardGrid({
  rolesList,
  onEditRole,
  onDeleteRole,
  isPending,
  canManage = true,
}: RoleCardGridProps) {
  const { t } = useTranslation();

  if (rolesList.length === 0) {
    return (
      <div className="p-12 text-center text-text-muted bg-structure border border-text-muted/15 rounded-xl">
        <p className="font-medium">{t("staffManagement.roleCardGrid.empty")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rolesList.map((role) => (
        <div
          key={role.id}
          className="bg-structure border border-text-muted/15 rounded-xl p-4 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-text-muted/30 transition-colors min-w-0"
        >
          {/* Role Name & System Tag */}
          <div className="min-w-0 md:w-48 flex items-center gap-2 shrink-0 pt-1">
            <h3 className="font-bold text-text-main text-base truncate" title={role.name}>
              {role.name}
            </h3>
            {role.system_key === "owner" && (
              <span className="text-[10px] px-2 py-0.5 bg-text-muted/10 text-text-muted font-medium rounded uppercase tracking-wider shrink-0">
                {t("staffManagement.roleCardGrid.systemRole")}
              </span>
            )}
          </div>

          {/* Grouped & Formatted Permissions Badge Grid */}
          <div className="flex-1 min-w-0">
            <PermissionsBadgeGrid permissions={role.permissions || []} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 justify-end border-t md:border-t-0 pt-2 md:pt-1 border-text-muted/10 shrink-0">
            {!canManage ? (
              <span className="text-xs text-text-muted italic truncate">
                {t("staffManagement.roleCardGrid.readOnly")}
              </span>
            ) : role.system_key === "owner" ? (
              <span className="text-xs text-text-muted italic truncate">
                {t("staffManagement.roleCardGrid.protected")}
              </span>
            ) : (
              <>
                {onEditRole && (
                  <button
                    type="button"
                    onClick={() => onEditRole(role)}
                    disabled={isPending}
                    className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50 shrink-0"
                    title={t("staffManagement.roleCardGrid.actions.editTitle")}
                    aria-label={t("staffManagement.roleCardGrid.actions.editTitle")}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDeleteRole(role.id, role.name)}
                  disabled={isPending}
                  className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50 shrink-0"
                  title={t("staffManagement.roleCardGrid.actions.deleteTitle")}
                  aria-label={t("staffManagement.roleCardGrid.actions.deleteTitle")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}