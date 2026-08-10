import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PermissionSelector } from "./PermissionSelector";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissionsCatalog: Array<string | { key: string }>;
  onSubmit: (data: { name: string; permissions: string[] }) => void;
  isPending: boolean;
}

export function CreateRoleModal({
  isOpen,
  onClose,
  permissionsCatalog,
  onSubmit,
  isPending,
}: CreateRoleModalProps) {
  const { t } = useTranslation();
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  if (!isOpen) return null;

  const catalogKeys = permissionsCatalog.map((perm) =>
    typeof perm === "string" ? perm : perm.key
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim() || selectedPermissions.length === 0) return;
    onSubmit({ name: roleName.trim(), permissions: selectedPermissions });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Modal Container: Height capped to 90vh, flex-col layout */}
      <div className="bg-structure border border-text-muted/20 rounded-xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Fixed Top Header */}
        <div className="flex items-center justify-between border-b border-text-muted/15 p-6 pb-4 shrink-0">
          <h2 className="text-lg font-bold text-text-main truncate pr-2">
            {t("staffManagement.createRoleModal.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-main rounded-md transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SINGLE SCROLL CONTAINER: Covers role name, all permissions, and submit actions */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Role Name Input */}
          <div>
            <label className="block text-xs font-semibold uppercase text-text-muted mb-1">
              {t("staffManagement.createRoleModal.labels.roleName")}
            </label>
            <input
              type="text"
              required
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm text-text-main focus:outline-none focus:border-primary truncate"
              placeholder={t("staffManagement.createRoleModal.placeholders.roleName")}
            />
          </div>

          {/* Permissions Wrapper (No inner max-heights or overflows) */}
          <div>
            <label className="block text-xs font-semibold uppercase text-text-muted mb-2">
              {t("staffManagement.createRoleModal.labels.permissions", {
                count: selectedPermissions.length,
              })}
            </label>
            <div className="border border-text-muted/15 rounded-lg p-3 bg-canvas/50">
              <PermissionSelector
                allPermissions={catalogKeys}
                selectedPermissions={selectedPermissions}
                onChange={setSelectedPermissions}
              />
            </div>
          </div>

          {/* Form Actions (Scrolls smoothly at the end of the form) */}
          <div className="flex justify-end gap-3 pt-3 border-t border-text-muted/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-main transition-colors truncate"
            >
              {t("staffManagement.createRoleModal.buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending || !roleName.trim() || selectedPermissions.length === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 truncate"
            >
              {isPending
                ? t("staffManagement.createRoleModal.buttons.submitting")
                : t("staffManagement.createRoleModal.buttons.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}