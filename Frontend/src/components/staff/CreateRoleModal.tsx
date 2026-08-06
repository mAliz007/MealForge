import { useState } from "react";
import { X } from "lucide-react";

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
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  if (!isOpen) return null;

  const handlePermissionToggle = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName || selectedPermissions.length === 0) return;
    onSubmit({ name: roleName, permissions: selectedPermissions });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-structure border border-text-muted/20 rounded-xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-text-muted/15 pb-3">
          <h2 className="text-lg font-bold text-text-main">Create Custom Role</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-text-muted hover:text-text-main" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Role Name</label>
            <input
              type="text"
              required
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. Head Chef"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2">
              Select Granted Permissions ({selectedPermissions.length} selected)
            </label>
            <div className="max-h-60 overflow-y-auto border border-text-muted/15 rounded-lg p-3 space-y-2 bg-canvas/50">
              {permissionsCatalog.map((perm) => {
                const permKey = typeof perm === "string" ? perm : perm.key;
                const isChecked = selectedPermissions.includes(permKey);
                return (
                  <label
                    key={permKey}
                    className="flex items-center justify-between text-xs p-2 rounded hover:bg-structure cursor-pointer"
                  >
                    <span className="font-mono text-text-main">{permKey}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handlePermissionToggle(permKey)}
                      className="rounded border-text-muted/30 text-primary focus:ring-primary h-4 w-4"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-main"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !roleName || selectedPermissions.length === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Save Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}