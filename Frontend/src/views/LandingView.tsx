// frontend/src/views/LandingView.tsx
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Utensils, ShieldCheck, Layers } from "lucide-react";

export default function LandingView() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex flex-col justify-between">
      {/* Top Header Navbar Context */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
            F
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">FoodSplits</span>
        </div>
        <Link to="/dashboard">
          <Button variant="secondary" className="font-semibold shadow-xs">Go to Dashboard</Button>
        </Link>
      </header>

      {/* Main Hero Screen Content Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 uppercase tracking-wider">
            ✨ Milestone 3 Live Viewports Available
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight">
            Group Meal Splitting <br />
            <span className="text-blue-600">Simplified Perfectly.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
            Welcome to the FoodSplits platform prototype layout shell. Navigate across integrated restaurant menus, simulated catalog arrays, and mock active item carts instantly.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <Link to="/dashboard">
              <Button variant="primary" className="px-6 py-3 text-base font-bold shadow-md hover:translate-y-[-1px] transition-transform">
                Launch Workspace App
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="px-6 py-3 text-base font-bold border border-gray-200">
                Sign In Screen
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Matrix Context Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
          <Card hoverable className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Utensils size={20} /></div>
            <h3 className="font-bold text-gray-900">Nested Router Framework</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Clean validation paradigms passing static variables down layout routes smoothly.</p>
          </Card>
          <Card hoverable className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><Layers size={20} /></div>
            <h3 className="font-bold text-gray-900">Mock Data Matrix</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Provides interactive loading states and empty view toggles out-of-the-box.</p>
          </Card>
          <Card hoverable className="space-y-3 sm:col-span-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600"><ShieldCheck size={20} /></div>
            <h3 className="font-bold text-gray-900">Fully Compliant Type Interfaces</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Enforces explicit properties for Restaurants, Menu Items, and active Orders ledger sheets.</p>
          </Card>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs font-semibold text-gray-400 tracking-wider">
        FOODSPLITS WORKSPACE INTERNSHIP © 2026
      </footer>
    </div>
  );
}