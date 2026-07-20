// frontend/src/components/menu-items/MenuFilterBar.tsx
import { useRestaurants } from "../../hooks/useRestaurants";
import { useTranslation } from "react-i18next";

interface MenuFilterBarProps {
  restaurantId: string;
  setRestaurantId: (id: string) => void;
  available: string;
  setAvailable: (state: string) => void;
}

export function MenuFilterBar({ restaurantId, setRestaurantId, available, setAvailable }: MenuFilterBarProps) {
  const { t } = useTranslation();
  const { data: restaurants, isLoading } = useRestaurants();

  return (
    <div className="bg-structure p-4 rounded-2xl border border-text-muted/10 shadow-sm flex flex-col sm:flex-row gap-4 items-end transition-colors duration-200">
      <div className="w-full sm:w-64 space-y-1.5">
        <label className="text-xs font-bold text-text-muted tracking-wide uppercase">
          {t("menu.filter.restaurantLabel")}
        </label>
        <select
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-xl border border-text-muted/20 px-3 py-2 text-sm bg-canvas text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 transition-all cursor-pointer"
        >
          <option value="" className="bg-structure">
            {t("menu.filter.allRestaurants")}
          </option>
          {restaurants?.map((r) => (
            <option key={r.id} value={r.id} className="bg-structure">
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-48 space-y-1.5">
        <label className="text-xs font-bold text-text-muted tracking-wide uppercase">
          {t("menu.filter.stockLabel")}
        </label>
        <select
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
          className="w-full rounded-xl border border-text-muted/20 px-3 py-2 text-sm bg-canvas text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
        >
          <option value="" className="bg-structure">
            {t("menu.filter.allListings")}
          </option>
          <option value="true" className="bg-structure">
            {t("menu.filter.inStock")}
          </option>
          <option value="false" className="bg-structure">
            {t("menu.filter.unavailable")}
          </option>
        </select>
      </div>
    </div>
  );
}