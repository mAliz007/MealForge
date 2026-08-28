import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRestaurantSearch } from "../../hooks/useRestaurantSearch";
import { useClickOutside } from "../../hooks/useClickOutside";

interface RestaurantSearchProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function RestaurantSearch({
  value,
  onSearch,
  placeholder,
}: RestaurantSearchProps) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    isLoading,
    isOpen,
    setIsOpen,
    selectedIndex,
    handleClear,
    selectRestaurant,
    selectDish,
    handleKeyDown,
  } = useRestaurantSearch({ initialValue: value, onSearch });

  useClickOutside(formRef, () => setIsOpen(false));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    onSearch(searchTerm);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="relative w-full">
      {/* Input Field using theme variables */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0 && searchTerm.trim().length >= 2) {
            setIsOpen(true);
          }
        }}
        placeholder={placeholder ?? t("restaurants.searchPlaceholder")}
        className="w-full pl-3 pr-16 py-2 text-sm bg-[var(--color-canvas)] text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] border border-[var(--color-structure)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-colors"
      />

      {/* Action Icons Bar */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 gap-1">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="p-1 animate-spin text-[var(--color-text-muted)]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}

        {/* Clear Button */}
        {searchTerm && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] rounded-full focus:outline-none transition-colors"
            aria-label={t("restaurants.clearSearch")}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Submit Search Button */}
        <button
          type="submit"
          className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] rounded-md focus:outline-none transition-colors"
          aria-label={t("restaurants.searchBtn")}
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Autocomplete Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--color-structure)] border border-[var(--color-structure)] rounded-md shadow-lg max-h-80 overflow-y-auto left-0 top-full transition-colors">
          {suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
              No matches found
            </div>
          ) : (
            <ul className="py-1">
              {suggestions.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li
                    key={item.id}
                    className={`px-4 py-2 text-sm cursor-pointer border-b border-[var(--color-canvas)]/20 last:border-0 transition-colors ${
                      isSelected
                        ? "bg-[var(--color-canvas)] text-[var(--color-accent)]"
                        : "hover:bg-[var(--color-canvas)]"
                    }`}
                  >
                    {/* Restaurant Name Header */}
                    <div
                      onClick={() => selectRestaurant(item)}
                      className="flex items-center justify-between font-medium text-[var(--color-text-main)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <span>{item.name}</span>
                      {item.cuisine && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-canvas)] text-[var(--color-text-muted)]">
                          {item.cuisine}
                        </span>
                      )}
                    </div>

                    {/* Matched Dishes Pills */}
                    {item.menu_item_names && item.menu_item_names.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.menu_item_names.map((dish, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectDish(dish);
                            }}
                            className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-canvas)] hover:text-[var(--color-accent)] px-2 py-0.5 rounded transition-colors"
                          >
                            <span>🍴 {dish}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}