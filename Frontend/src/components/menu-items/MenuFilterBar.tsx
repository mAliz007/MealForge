import { useState, useRef, useEffect } from "react";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useTranslation } from "react-i18next";
import { MenuItemSearch } from "./MenuItemSearch";

interface MenuFilterBarProps {
  restaurantId: string;
  setRestaurantId: (id: string) => void;
  available: string;
  setAvailable: (state: string) => void;
  search: string;
  setSearch: (query: string) => void;
}

export function MenuFilterBar({
  restaurantId,
  setRestaurantId,
  available,
  setAvailable,
  search,
  setSearch,
}: MenuFilterBarProps) {
  const { t } = useTranslation();

  // 1. Restaurant Search Dropdown State
  const [restQuery, setRestQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch matching restaurants dynamically as user types in restaurant filter
  const { data: restResponse, isLoading: isRestLoading } = useRestaurants(
    1,
    10,
    restQuery
  );
  const matchedRestaurants = restResponse?.data || [];

  // Active selected restaurant check
  const selectedRestaurant = matchedRestaurants.find(
    (r) => String(r.id) === restaurantId
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRestaurant = (id: string, name: string) => {
    setRestaurantId(id);
    setRestQuery(name);
    setIsDropdownOpen(false);
  };

  const handleClearRestaurant = () => {
    setRestaurantId("");
    setRestQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-structure p-4 rounded-2xl border border-text-muted/10 shadow-sm flex flex-col sm:flex-row flex-wrap gap-4 items-end transition-colors duration-200">
      
      {/* 1. Restaurant Search & Select Overlay Filter */}
      <div className="w-full sm:w-64 space-y-1.5 relative" ref={dropdownRef}>
        <label className="text-xs font-bold text-text-muted tracking-wide uppercase">
          {t("menu.filter.restaurantLabel")}
        </label>
        <div className="relative">
          <input
            type="text"
            value={
              isDropdownOpen
                ? restQuery
                : selectedRestaurant?.name || restQuery
            }
            onChange={(e) => {
              setRestQuery(e.target.value);
              if (!isDropdownOpen) setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder={t("menu.filter.searchRestaurantPlaceholder", {
              defaultValue: "Search restaurant...",
            })}
            className="w-full rounded-xl border border-text-muted/20 px-3 py-2 pr-8 text-sm bg-canvas text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {restaurantId && (
            <button
              type="button"
              onClick={handleClearRestaurant}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Floating Dropdown Results Overlay */}
        {isDropdownOpen && (
          <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-text-muted/20 bg-structure shadow-lg divide-y divide-text-muted/10">
            <button
              type="button"
              onClick={handleClearRestaurant}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-canvas transition-colors ${
                !restaurantId ? "font-semibold text-blue-600" : "text-text-muted"
              }`}
            >
              {t("menu.filter.allRestaurants")}
            </button>

            {isRestLoading ? (
              <div className="px-3 py-2 text-xs text-text-muted">Loading...</div>
            ) : matchedRestaurants.length === 0 ? (
              <div className="px-3 py-2 text-xs text-text-muted">
                No restaurants found
              </div>
            ) : (
              matchedRestaurants.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRestaurant(String(r.id), r.name)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-canvas transition-colors flex justify-between items-center ${
                    restaurantId === String(r.id)
                      ? "bg-blue-500/10 font-medium text-blue-600"
                      : "text-text-main"
                  }`}
                >
                  <span>{r.name}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* 2. Menu Item Search Input Component */}
      <div className="w-full sm:w-64 space-y-1.5">
        <label className="text-xs font-bold text-text-muted tracking-wide uppercase">
          {t("menu.filter.searchLabel", { defaultValue: "Search Menu Items" })}
        </label>
        <MenuItemSearch value={search} onSearch={setSearch} />
      </div>

      {/* 3. Availability / Stock Status Filter Select */}
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