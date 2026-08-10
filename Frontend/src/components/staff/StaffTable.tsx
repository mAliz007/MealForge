import { Users, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface StaffMember {
  membership_id: number;
  user_id: number;
  name: string;
  email: string;
  status: string;
  role: {
    id: number;
    name: string;
  };
}

interface StaffTableProps {
  staffList: StaffMember[];
  onRevoke: (membershipId: number, name: string) => void;
  isPending?: boolean;
  canManage?: boolean;
}

export function StaffTable({
  staffList,
  onRevoke,
  isPending,
  canManage = true,
}: StaffTableProps) {
  const { t } = useTranslation();

  if (staffList.length === 0) {
    return (
      <div className="p-12 text-center text-text-muted bg-structure border border-text-muted/15 rounded-xl">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-30 shrink-0" />
        <p className="font-medium">{t("staffManagement.staffTable.empty.title")}</p>
        <p className="text-xs mt-1 text-text-muted">{t("staffManagement.staffTable.empty.subtitle")}</p>
      </div>
    );
  }

  return (
    <div className="bg-structure border border-text-muted/15 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed">
          <thead className="bg-canvas/50 text-text-muted text-xs uppercase tracking-wider border-b border-text-muted/15">
            <tr>
              <th className="px-6 py-3 w-1/4">{t("staffManagement.staffTable.headers.name")}</th>
              <th className="px-6 py-3 w-1/3">{t("staffManagement.staffTable.headers.email")}</th>
              <th className="px-6 py-3 w-1/6">{t("staffManagement.staffTable.headers.role")}</th>
              <th className="px-6 py-3 w-1/6">{t("staffManagement.staffTable.headers.status")}</th>
              <th className="px-6 py-3 text-right w-24">{t("staffManagement.staffTable.headers.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-text-muted/15">
            {staffList.map((member) => (
              <tr key={member.membership_id} className="hover:bg-canvas/30 transition-colors">
                {/* Name */}
                <td className="px-6 py-4 font-medium text-text-main truncate max-w-[180px]" title={member.name}>
                  {member.name}
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-text-muted truncate max-w-[220px]" title={member.email}>
                  {member.email}
                </td>

                {/* Role */}
                <td className="px-6 py-4 truncate">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary truncate max-w-full"
                    title={member.role?.name || t("staffManagement.staffTable.defaultRole")}
                  >
                    {member.role?.name || t("staffManagement.staffTable.defaultRole")}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 truncate">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize truncate ${
                      member.status === "active"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {t(`staffManagement.staffTable.status.${member.status}`, member.status)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right shrink-0">
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() => onRevoke(member.membership_id, member.name)}
                      disabled={isPending}
                      className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50 shrink-0"
                      title={t("staffManagement.staffTable.actions.revokeTitle")}
                      aria-label={t("staffManagement.staffTable.actions.revokeTitle")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <span className="text-xs text-text-muted italic truncate">
                      {t("staffManagement.staffTable.readOnly")}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}