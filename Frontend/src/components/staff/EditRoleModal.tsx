import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Permission } from "../../types/auth";
import type { RoleItem } from "./RoleCardGrid";
import { PermissionSelector } from "./PermissionSelector";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleItem | null;
  permissionsCatalog: Permission[];
  onSubmit: (roleId: number, payload: { name: string; permissions: string[] }) => void;
  isPending?: boolean;
}

export function EditRoleModal({
  isOpen,
  onClose,
  role,
  permissionsCatalog,
  onSubmit,
  isPending,
}: EditRoleModalProps) {
  const { t } = useTranslation();
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setSelectedPermissions(role.permissions || []);
    }
  }, [role]);

  if (!isOpen || !role) return null;

  // Extract catalog keys into simple array of strings
  const catalogKeys = permissionsCatalog.map((perm) =>
    typeof perm === "string" ? perm : perm.key
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;
    onSubmit(role.id, {
      name: roleName.trim(),
      permissions: selectedPermissions,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Outer Modal Container with max height set */}
      <div className="bg-structure border border-text-muted/15 rounded-xl max-w-xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-text-muted/10 p-6 pb-4 shrink-0">
          <h2 className="text-lg font-bold text-text-main truncate pr-2">
            {t("staffManagement.editRoleModal.title", { name: role.name })}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-main rounded-md transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Single Scroll Container wrapping all form elements */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Role Name */}
          <div>
            <label className="block text-xs font-semibold uppercase text-text-muted mb-1">
              {t("staffManagement.editRoleModal.labels.roleName")}
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm text-text-main focus:outline-none focus:border-primary truncate"
              required
            />
          </div>

          {/* Permissions Section */}
          <div>
            <label className="block text-xs font-semibold uppercase text-text-muted mb-2">
              {t("staffManagement.editRoleModal.labels.permissions")}
            </label>
            <div className="border border-text-muted/15 rounded-lg p-3 bg-canvas/50">
              <PermissionSelector
                allPermissions={catalogKeys}
                selectedPermissions={selectedPermissions}
                onChange={setSelectedPermissions}
              />
            </div>
          </div>

          {/* Form Action Buttons at the bottom of the scroll view */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-text-muted/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors truncate"
            >
              {t("staffManagement.editRoleModal.buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending || !roleName.trim()}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 truncate"
            >
              {isPending
                ? t("staffManagement.editRoleModal.buttons.submitting")
                : t("staffManagement.editRoleModal.buttons.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}