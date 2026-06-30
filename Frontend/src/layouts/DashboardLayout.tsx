// frontend/src/layouts/DashboardLayout.tsx
import { type ReactNode } from "react";
import { LayoutDashboard, Receipt, Users, Settings, LogOut, Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigationItems = [
    { name: "Overview", icon: LayoutDashboard, active: true },
    { name: "Expenses", icon: Receipt, active: false },
    { name: "Group Management", icon: Users, active: false },
    { name: "System Settings", icon: Settings, active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Structural Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between fixed inset-y-0 left-0 z-20">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          {/* Platform Identity Branding Header */}
          <div className="flex items-center flex-shrink-0 px-6 gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">SmartSplit</span>
          </div>
          
          {/* Navigation Link Stack */}
          <nav className="mt-8 flex-1 px-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href="#"
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                    item.active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${item.active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"}`} />
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>

        {/* User Workspace Management Footer Action */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <button className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors group cursor-pointer">
            <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Viewport Container Context Panel */}
      <div className="md:pl-64 flex flex-col flex-1 w-0">
        {/* Responsive Mobile Top Header Layout */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 md:hidden items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">SmartSplit</span>
          </div>
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Core Content Delivery Target Block */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none py-6 px-4 sm:px-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}