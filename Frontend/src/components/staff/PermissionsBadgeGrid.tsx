import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { groupPermissions } from "../../utils/permissionUtils";

interface PermissionsBadgeGridProps {
  permissions: string[];
}

// Color coding for different action types
const ACTION_COLORS: Record<string, string> = {
  read: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  create: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  update: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  update_status: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  destroy: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  manage: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

export function PermissionsBadgeGrid({ permissions }: PermissionsBadgeGridProps) {
  const { t } = useTranslation();
  const grouped = useMemo(() => groupPermissions(permissions), [permissions]);

  if (!permissions || permissions.length === 0) {
    return (
      <span className="text-xs text-text-muted italic">
        {t("staffManagement.roleCardGrid.noPermissions")}
      </span>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {grouped.map((group) => (
        <div
          key={group.moduleKey}
          className="p-2.5 rounded-lg border border-text-muted/15 bg-text-muted/5 space-y-1.5"
        >
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            {group.moduleLabel}
          </h4>
          <div className="flex flex-wrap gap-1">
            {group.permissions.map((perm) => {
              const colorClass =
                ACTION_COLORS[perm.actionKey] ||
                "bg-gray-500/10 text-gray-600 border-gray-500/20";

              return (
                <span
                  key={perm.raw}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md border ${colorClass}`}
                >
                  {perm.actionLabel}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}