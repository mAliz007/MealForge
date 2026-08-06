import { Users, Trash2 } from "lucide-react";

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
}

export function StaffTable({ staffList, onRevoke, isPending }: StaffTableProps) {
  if (staffList.length === 0) {
    return (
      <div className="p-12 text-center text-text-muted bg-structure border border-text-muted/15 rounded-xl">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No staff members found.</p>
        <p className="text-xs mt-1">Add your first employee to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-structure border border-text-muted/15 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-canvas/50 text-text-muted text-xs uppercase tracking-wider border-b border-text-muted/15">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-text-muted/15">
            {staffList.map((member) => (
              <tr key={member.membership_id} className="hover:bg-canvas/30 transition-colors">
                <td className="px-6 py-4 font-medium text-text-main">{member.name}</td>
                <td className="px-6 py-4 text-text-muted">{member.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {member.role?.name || "Staff"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      member.status === "active"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onRevoke(member.membership_id, member.name)}
                    disabled={isPending}
                    className="p-1.5 text-text-muted hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Revoke Staff Access"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}