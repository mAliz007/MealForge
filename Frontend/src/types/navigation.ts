// frontend/src/types/navigation.ts
import type { LucideIcon } from "lucide-react";

/**
 * Represents a single item within the application's navigation components
 * (such as DesktopSidebar and MobileNavigation).
 */
export interface NavigationItem {
  /** 
   * The localized title or translation key displayed on the navigation item.
   */
  name: string;

  /** 
   * The destination URL route path (e.g., from `ROUTES` constants).
   */
  path: string;

  /** 
   * The Lucide icon component associated with this navigation item.
   */
  icon: LucideIcon;
}