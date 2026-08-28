export interface ParsedPermission {
  raw: string;
  actionKey: string;
  actionLabel: string;
}

export interface GroupedPermissions {
  moduleKey: string;
  moduleLabel: string;
  permissions: ParsedPermission[];
}

// Friendly display names for actions/verbs
const ACTION_LABELS: Record<string, string> = {
  create: "Create",
  read: "View",
  update: "Edit",
  destroy: "Delete",
  manage: "Manage All",
  update_status: "Update Status",
};

// Friendly display names for resource modules
const MODULE_LABELS: Record<string, string> = {
  menu_item: "Menu Items",
  order: "Orders",
  restaurant: "Restaurant Settings",
  role: "Roles & Access",
  staff: "Staff Members",
};

/**
 * Groups raw permission strings (e.g. "menu_item.create") by module.
 */
export function groupPermissions(permissions: string[]): GroupedPermissions[] {
  // Deduplicate array
  const uniquePermissions = Array.from(new Set(permissions));
  const groupsMap = new Map<string, GroupedPermissions>();

  uniquePermissions.forEach((perm) => {
    if (!perm.includes(".")) return;

    const [moduleKey, actionKey] = perm.split(".");

    // Fallback formatting if key isn't in dictionaries (e.g., "user_account" -> "User Account")
    const moduleLabel =
      MODULE_LABELS[moduleKey] ||
      moduleKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    const actionLabel =
      ACTION_LABELS[actionKey] ||
      actionKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    if (!groupsMap.has(moduleKey)) {
      groupsMap.set(moduleKey, {
        moduleKey,
        moduleLabel,
        permissions: [],
      });
    }

    groupsMap.get(moduleKey)!.permissions.push({
      raw: perm,
      actionKey,
      actionLabel,
    });
  });

  return Array.from(groupsMap.values());
}