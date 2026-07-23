import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface MenuItemSearchProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function MenuItemSearch({
  value,
  onSearch,
  placeholder,
}: MenuItemSearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(value);

  // Sync internal state if parent resets value (e.g., clearing search filters)
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder ?? t("menu.searchPlaceholder", "Search menu items...")}
        className="w-full pl-3 pr-16 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      />

      <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 gap-1">
        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none"
            aria-label={t("menu.clearSearch", "Clear search")}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Magnifying Glass Search Button */}
        <button
          type="submit"
          className="p-1.5 text-gray-500 hover:text-primary rounded-md focus:outline-none transition-colors"
          aria-label={t("menu.searchBtn", "Search")}
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
    </form>
  );
}