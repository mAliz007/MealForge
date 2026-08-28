import { useState, useEffect, useCallback } from "react";
import { fetchRestaurantAutocomplete } from "../services/restaurantService";
import { type SuggestionItem } from "../types/search";
import { useDebounce } from "./useDebounce";

interface UseRestaurantSearchOptions {
  initialValue?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function useRestaurantSearch({
  initialValue = "",
  onSearch,
  debounceMs = 300,
}: UseRestaurantSearchOptions) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(searchTerm.trim(), debounceMs);

  // Sync state if initialValue changes externally
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Fetch autocomplete data when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetchRestaurantAutocomplete(debouncedQuery, controller.signal)
      .then((data) => {
        setSuggestions(data);
        setIsOpen(true);
        setSelectedIndex(-1);
      })
      .catch((err: unknown) => {
        if (err && typeof err === "object" && "name" in err && err.name === "CanceledError") {
          return;
        }
        setSuggestions([]);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    setSuggestions([]);
    setIsOpen(false);
    onSearch("");
  }, [onSearch]);

  const selectRestaurant = useCallback((item: SuggestionItem) => {
    setSearchTerm(item.name);
    setIsOpen(false);
    onSearch(item.name);
  }, [onSearch]);

  const selectDish = useCallback((dishName: string) => {
    setSearchTerm(dishName);
    setIsOpen(false);
    onSearch(dishName);
  }, [onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[selectedIndex];
      if (selected) selectRestaurant(selected);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, [isOpen, suggestions, selectedIndex, selectRestaurant]);

  return {
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
  };
}