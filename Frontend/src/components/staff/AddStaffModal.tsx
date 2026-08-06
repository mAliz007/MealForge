import { useState } from "react";
import { X } from "lucide-react";
import { type RoleItem } from "./RoleCardGrid";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  rolesList: RoleItem[];
  onSubmit: (data: { name: string; email: string; password?: string; role_id: number }) => void;
  isPending: boolean;
}

export function AddStaffModal({ isOpen, onClose, rolesList, onSubmit, isPending }: AddStaffModalProps) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role_id: "" });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role_id) return;
    onSubmit({
      name: form.name,
      email: form.email,
      password: form.password || undefined,
      role_id: Number(form.role_id),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-structure border border-text-muted/20 rounded-xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-text-muted/15 pb-3">
          <h2 className="text-lg font-bold text-text-main">Add Staff Member</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-text-muted hover:text-text-main" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. john@restaurant.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">
              Password (Optional if user exists)
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Assign Custom Role</label>
            <select
              required
              value={form.role_id}
              onChange={(e) => setForm({ ...form, role_id: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option value="">Select a role...</option>
              {rolesList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
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
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Assigning..." : "Assign Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}