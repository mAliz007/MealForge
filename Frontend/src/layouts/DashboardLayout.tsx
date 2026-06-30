// frontend/src/layouts/DashboardLayout.tsx
import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Utensils, BookOpen, ShoppingBag, ShoppingCart, LogOut, Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();

  const navigationItems = [
    { name: "Restaurants", path: "/dashboard/restaurants", icon: Utensils },
    { name: "Menu Catalog", path: "/dashboard/menu-items", icon: BookOpen },
    { name: "Orders Ledger", path: "/dashboard/orders", icon: ShoppingBag },
    { name: "Active Cart", path: "/dashboard/cart", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Structural Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between fixed inset-y-0 left-0 z-20">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          {/* Platform Identity Branding Header */}
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

        {/* Logout Control Action */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Link to="/login" className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors group">
            <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Viewport Container Context Panel */}
      <div className="md:pl-64 flex flex-col flex-1 w-0">
        {/* Responsive Mobile Top Header Layout */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 md:hidden items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">FoodSplits</span>
          </div>
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Content Render Target Area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none py-6 px-4 sm:px-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}