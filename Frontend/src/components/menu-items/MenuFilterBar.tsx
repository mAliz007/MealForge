import { useState, useRef, useEffect } from "react";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useAuthUser } from "../../hooks/useAuthUser";
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
  const { isAdmin, isOwner, restaurantId: userRestaurantId } = useAuthUser();

  // Allow Super Admins AND Customers (users without a locked userRestaurantId) to select restaurants
  const canSelectRestaurant = isAdmin || (!isOwner && !userRestaurantId);

  // 1. Restaurant Search Dropdown State
  const [restQuery, setRestQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch matching restaurants dynamically (executed for Admins & Customers)
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
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
      
      {/* 1. Restaurant Search & Select Filter (Visible for Admins AND Customers) */}
      {canSelectRestaurant && (
        <div className="w-full sm:w-64 space-y-1 relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-text-muted">
            {t("menu.filter.restaurantLabel", "Restaurant")}
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
              placeholder={t("menu.filter.searchRestaurantPlaceholder", "Search restaurant...")}
              className="w-full pl-3 pr-8 py-2 text-sm border border-text-muted/20 rounded-md shadow-sm bg-structure text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
            />
            {restaurantId && (
              <button
                type="button"
                onClick={handleClearRestaurant}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main text-xs font-bold transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Floating Dropdown Results Overlay */}
          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-md border border-text-muted/20 bg-structure shadow-lg divide-y divide-text-muted/10 transition-colors">
              <button
                type="button"
                onClick={handleClearRestaurant}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-canvas transition-colors ${
                  !restaurantId ? "font-semibold text-brand-primary" : "text-text-muted"
                }`}
              >
                {t("menu.filter.allRestaurants", "All Restaurants")}
              </button>

              {isRestLoading ? (
                <div className="flex items-center gap-2 px-3 py-2 text-xs text-text-muted">
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-brand-primary" />
                  {t("menu.filter.loading", "Loading...")}
                </div>
              ) : matchedRestaurants.length === 0 ? (
                <div className="px-3 py-2 text-xs text-text-muted">
                  {t("menu.filter.noRestaurants", "No restaurants found")}
                </div>
              ) : (
                matchedRestaurants.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRestaurant(String(r.id), r.name)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-canvas transition-colors flex justify-between items-center ${
                      restaurantId === String(r.id)
                        ? "bg-brand-primary/10 font-medium text-brand-primary"
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
      )}

      {/* 2. Menu Item Search Input Component */}
      <div className="w-full sm:w-64 space-y-1">
        <label className="text-xs font-semibold text-text-muted">
          {t("menu.filter.searchLabel", "Search Menu Items")}
        </label>
        <MenuItemSearch value={search} onSearch={setSearch} />
      </div>

      {/* 3. Availability / Stock Status Filter Select */}
      <div className="w-full sm:w-48 space-y-1">
        <label className="text-xs font-semibold text-text-muted">
          {t("menu.filter.stockLabel", "Availability")}
        </label>
        <select
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-text-muted/20 rounded-md shadow-sm bg-structure text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors cursor-pointer dark:[color-scheme:dark]"
        >
          <option value="" className="bg-structure text-text-main">
            {t("menu.filter.allListings", "All Listings")}
          </option>
          <option value="true" className="bg-structure text-text-main">
            {t("menu.filter.inStock", "In Stock")}
          </option>
          <option value="false" className="bg-structure text-text-main">
            {t("menu.filter.unavailable", "Unavailable")}
          </option>
        </select>
      </div>

    </div>
  );
}