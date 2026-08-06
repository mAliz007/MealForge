import { Trash2 } from "lucide-react";

export interface RoleItem {
  id: number;
  name: string;
  system_key?: string | null;
  permissions: string[];
}

interface RoleCardGridProps {
  rolesList: RoleItem[];
  onDeleteRole: (roleId: number, roleName: string) => void;
  isPending?: boolean;
}

export function RoleCardGrid({ rolesList, onDeleteRole, isPending }: RoleCardGridProps) {
  if (rolesList.length === 0) {
    return (
      <div className="p-12 text-center text-text-muted bg-structure border border-text-muted/15 rounded-xl">
        <p className="font-medium">No roles found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rolesList.map((role) => (
        <div
          key={role.id}
          className="bg-structure border border-text-muted/15 rounded-xl p-5 space-y-3 relative group hover:border-text-muted/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-text-main">{role.name}</h3>
            <div className="flex items-center gap-2">
              {role.system_key ? (
                <span className="text-xs px-2 py-0.5 bg-text-muted/10 text-text-muted rounded">
                  System Role
                </span>
              ) : (
                <button
                  onClick={() => onDeleteRole(role.id, role.name)}
                  disabled={isPending}
                  className="p-1 text-text-muted hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Delete Custom Role"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-text-muted">Granted Permissions:</p>
          <div className="flex flex-wrap gap-1.5">
            {role.permissions?.map((perm) => (
              <span
                key={perm}
                className="text-[11px] px-2 py-0.5 rounded bg-primary/10 text-primary font-mono"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}