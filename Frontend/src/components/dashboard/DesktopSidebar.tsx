import { Link, useLocation } from "react-router-dom";
import { LogOut,type LucideIcon } from "lucide-react";

interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface DesktopSidebarProps {
  navigationItems: NavigationItem[];
  onLogout: () => void;
  isLogoutPending: boolean;
}

export function DesktopSidebar({ navigationItems, onLogout, isLogoutPending }: DesktopSidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between fixed inset-y-0 left-0 z-20">
      <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
        {/* Branding Header */}
        <div className="flex items-center flex-shrink-0 px-6 gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">FoodSplits</span>
        </div>
        
        {/* Navigation Link Stack */}
        <nav className="mt-8 flex-1 px-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Control Action Button */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <button 
          onClick={onLogout}
          disabled={isLogoutPending}
          className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
          {isLogoutPending ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}