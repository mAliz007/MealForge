import { useMemo } from "react";
import { groupPermissions } from "../../utils/permissionUtils";

interface PermissionSelectorProps {
  allPermissions: string[];
  selectedPermissions: string[];
  onChange: (updatedPermissions: string[]) => void;
}

export function PermissionSelector({
  allPermissions,
  selectedPermissions,
  onChange,
}: PermissionSelectorProps) {
  // Group available permissions into modules
  const grouped = useMemo(() => groupPermissions(allPermissions), [allPermissions]);

  const toggleSinglePermission = (permKey: string) => {
    if (selectedPermissions.includes(permKey)) {
      onChange(selectedPermissions.filter((p) => p !== permKey));
    } else {
      onChange([...selectedPermissions, permKey]);
    }
  };

  const toggleModuleAll = (modulePerms: string[]) => {
    const isAllSelected = modulePerms.every((p) => selectedPermissions.includes(p));

    if (isAllSelected) {
      // Uncheck all permissions in this module
      onChange(selectedPermissions.filter((p) => !modulePerms.includes(p)));
    } else {
      // Check all permissions in this module
      const combined = new Set([...selectedPermissions, ...modulePerms]);
      onChange(Array.from(combined));
    }
  };

  return (
    /* Removed max-h-[380px] and overflow-y-auto so it doesn't get trapped/hidden */
    <div className="space-y-4">
      {grouped.map((group) => {
        const groupRawPerms = group.permissions.map((p) => p.raw);
        const isAllModuleSelected = groupRawPerms.every((p) =>
          selectedPermissions.includes(p)
        );

        return (
          <div
            key={group.moduleKey}
            className="p-3.5 rounded-xl border border-text-muted/15 bg-text-muted/5 space-y-2.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-text-muted/10">
              <span className="text-xs font-bold uppercase tracking-wider text-text-main">
                {group.moduleLabel}
              </span>
              <button
                type="button"
                onClick={() => toggleModuleAll(groupRawPerms)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {isAllModuleSelected ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {group.permissions.map((perm) => {
                const isChecked = selectedPermissions.includes(perm.raw);

                return (
                  <label
                    key={perm.raw}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border text-xs font-medium transition-all ${
                      isChecked
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-text-muted/20 hover:bg-text-muted/10 text-text-muted"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSinglePermission(perm.raw)}
                      className="rounded border-text-muted/30 text-primary focus:ring-primary"
                    />
                    {perm.actionLabel}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}