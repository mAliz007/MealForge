import { useRestaurants } from "../../hooks/useRestaurants";

interface MenuFilterBarProps {
  restaurantId: string;
  setRestaurantId: (id: string) => void;
  available: string;
  setAvailable: (state: string) => void;
}

export function MenuFilterBar({ restaurantId, setRestaurantId, available, setAvailable }: MenuFilterBarProps) {
  const { data: restaurants, isLoading } = useRestaurants();

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
      <div className="w-full sm:w-64 space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 tracking-wide uppercase">Partner Restaurant</label>
        <select
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="">-- All Registered Partners --</option>
          {restaurants?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-48 space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 tracking-wide uppercase">Stock State</label>
        <select
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="">Show All Listings</option>
          <option value="true">In Stock Only</option>
          <option value="false">Unavailable Only</option>
        </select>
      </div>
    </div>
  );
}