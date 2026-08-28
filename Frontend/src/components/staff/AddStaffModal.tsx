import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type RoleItem } from "./RoleCardGrid";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  rolesList: RoleItem[];
  onSubmit: (data: { name: string; email: string; password?: string; role_id: number }) => void;
  isPending: boolean;
}

export function AddStaffModal({ isOpen, onClose, rolesList, onSubmit, isPending }: AddStaffModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [form, setForm] = useState({ name: "", email: "", password: "", role_id: "" });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role_id) return;

    if (mode === "existing") {
      onSubmit({
        name: "", // Pass empty string so name is always a string, matching parent expectations
        email: form.email,
        role_id: Number(form.role_id),
      });
    } else {
      onSubmit({
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        role_id: Number(form.role_id),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-structure border border-text-muted/20 rounded-xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-text-muted/15 pb-3">
          <h2 className="text-lg font-bold text-text-main">
            {t("staffManagement.addStaffModal.title")}
          </h2>
          <button onClick={onClose} type="button" className="p-1 rounded-md text-text-muted hover:text-text-main transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Theme-Aware Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-canvas p-1 rounded-lg border border-text-muted/20">
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`py-2 text-xs font-semibold rounded-md transition-all ${
              mode === "new"
                ? "bg-text-main text-canvas shadow-md font-bold"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            Create New User
          </button>
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`py-2 text-xs font-semibold rounded-md transition-all ${
              mode === "existing"
                ? "bg-text-main text-canvas shadow-md font-bold"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            Add Existing User
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "new" && (
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">
                {t("staffManagement.addStaffModal.labels.fullName")}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary"
                placeholder={t("staffManagement.addStaffModal.placeholders.fullName")}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">
              {t("staffManagement.addStaffModal.labels.email")}
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary"
              placeholder={t("staffManagement.addStaffModal.placeholders.email")}
            />
          </div>

          {mode === "new" && (
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">
                {t("staffManagement.addStaffModal.labels.password")}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary"
                placeholder={t("staffManagement.addStaffModal.placeholders.password")}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">
              {t("staffManagement.addStaffModal.labels.role")}
            </label>
            <select
              required
              value={form.role_id}
              onChange={(e) => setForm({ ...form, role_id: e.target.value })}
              className="w-full px-3 py-2 bg-canvas border border-text-muted/20 rounded-lg text-sm text-text-main focus:outline-none focus:border-primary"
            >
              <option value="" className="bg-structure text-text-main">
                {t("staffManagement.addStaffModal.placeholders.selectRole")}
              </option>
              {rolesList.map((r) => (
                <option key={r.id} value={r.id} className="bg-structure text-text-main">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-text-muted/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-main transition-colors"
            >
              {t("staffManagement.addStaffModal.buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-canvas bg-text-main rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending
                ? t("staffManagement.addStaffModal.buttons.submitting")
                : t("staffManagement.addStaffModal.buttons.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}